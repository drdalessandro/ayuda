/**
 * EPA Bienestar — Algoritmo de Scoring Life's Essential 8
 *
 * Basado en: American Heart Association (2022)
 * "Life's Essential 8: Updating and Enhancing the American Heart Association's
 *  Construct of Cardiovascular Health"
 * DOI: 10.1161/CIR.0000000000001078
 *
 * Cada dominio puntúa de 0 a 100.
 * El score global es el promedio simple de los 8 dominios.
 *
 * Cuando un dato no está disponible se usa la lógica de proxy documentada.
 */

import type { QuestionnaireResponse } from '@spezivibe/questionnaire';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface Le8DomainScore {
  /** Identificador del dominio */
  domain: Le8Domain;
  /** Nombre para mostrar en español */
  label: string;
  /** Score 0–100 */
  score: number;
  /** Nivel semáforo */
  level: 'optimal' | 'intermediate' | 'inadequate';
  /** Breve explicación personalizada */
  message: string;
  /** Si el score se calculó con datos proxy (sin lab) */
  isProxy: boolean;
}

export interface Le8Score {
  /** Score global 0–100 (promedio de 8 dominios) */
  global: number;
  /** Nivel semáforo global */
  globalLevel: 'optimal' | 'intermediate' | 'inadequate';
  /** Scores por dominio */
  domains: Le8DomainScore[];
  /** Los 2 dominios con menor score — foco del Plan 100 Días® */
  priorityDomains: Le8Domain[];
  /** Fecha de evaluación */
  assessedAt: Date;
}

export type Le8Domain =
  | 'diet'
  | 'physical_activity'
  | 'nicotine'
  | 'sleep'
  | 'body_weight'
  | 'blood_lipids'
  | 'blood_glucose'
  | 'blood_pressure';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getAnswer(response: QuestionnaireResponse, linkId: string): string | boolean | number | undefined {
  for (const item of response.item ?? []) {
    if (item.linkId === linkId) {
      const ans = item.answer?.[0];
      if (!ans) return undefined;
      if (ans.valueBoolean !== undefined) return ans.valueBoolean;
      if (ans.valueCoding?.code !== undefined) return ans.valueCoding.code;
      if (ans.valueInteger !== undefined) return ans.valueInteger;
      if (ans.valueDecimal !== undefined) return ans.valueDecimal;
      if (ans.valueString !== undefined) return ans.valueString;
    }
  }
  return undefined;
}

function levelFromScore(score: number): 'optimal' | 'intermediate' | 'inadequate' {
  if (score >= 80) return 'optimal';
  if (score >= 50) return 'intermediate';
  return 'inadequate';
}

// ── Scoring por dominio ───────────────────────────────────────────────────────

function scoreDiet(r: QuestionnaireResponse): Pick<Le8DomainScore, 'score' | 'message' | 'isProxy'> {
  const frutas = getAnswer(r, 'frutas_verduras') as string | undefined;
  const ultra = getAnswer(r, 'ultraprocesados') as string | undefined;
  const sodio = getAnswer(r, 'sodio') as string | undefined;

  const frutaScore: Record<string, number> = {
    '0': 0, '2': 40, '4': 75, '5plus': 100,
  };
  const ultraScore: Record<string, number> = {
    'daily': 0, 'frequent': 25, 'occasional': 65, 'rare': 100,
  };
  const sodioScore: Record<string, number> = {
    'always': 0, 'sometimes': 50, 'rarely': 100,
  };

  const scores = [
    frutaScore[frutas ?? ''] ?? 50,
    ultraScore[ultra ?? ''] ?? 50,
    sodioScore[sodio ?? ''] ?? 50,
  ];

  const score = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  const messages: Record<string, string> = {
    optimal:      'Tu alimentación es una fortaleza. Seguí así.',
    intermediate: 'Hay oportunidades para mejorar tu dieta y reducir el riesgo cardíaco.',
    inadequate:   'Mejorar la alimentación es la palanca más poderosa para tu corazón.',
  };

  return { score, message: messages[levelFromScore(score)], isProxy: false };
}

function scorePhysicalActivity(r: QuestionnaireResponse): Pick<Le8DomainScore, 'score' | 'message' | 'isProxy'> {
  const moderada = getAnswer(r, 'actividad_moderada') as string | undefined;
  const intensa = getAnswer(r, 'actividad_intensa') as string | undefined;
  const sedentaria = getAnswer(r, 'sedentarismo_prolongado') as boolean | undefined;

  // Convertir moderada a minutos equivalentes
  const minModerada: Record<string, number> = {
    '0': 0, '1_59': 30, '60_119': 90, '120_149': 135, '150plus': 150,
  };
  // Convertir intensa a minutos equivalentes (1 min intensa = 2 min moderada)
  const minIntensa: Record<string, number> = {
    'no': 0, '1_74': 37, '75plus': 75,
  };

  const totalEquivalent =
    (minModerada[moderada ?? ''] ?? 0) +
    (minIntensa[intensa ?? ''] ?? 0) * 2;

  let score: number;
  if (totalEquivalent === 0) score = 0;
  else if (totalEquivalent < 60) score = 20;
  else if (totalEquivalent < 120) score = 40;
  else if (totalEquivalent < 150) score = 65;
  else score = 100;

  // Penalización leve por sedentarismo prolongado
  if (sedentaria === true && score > 0) {
    score = Math.max(0, score - 10);
  }

  const messages: Record<string, string> = {
    optimal:      '¡Excelente actividad física! Tu corazón y tus huesos te lo agradecen.',
    intermediate: 'Estás en camino. Sumar 30 minutos de caminata diaria marca una diferencia real.',
    inadequate:   'Comenzar a moverse es el cambio con mayor impacto en la menopausia. Podemos ayudarte.',
  };

  return { score, message: messages[levelFromScore(score)], isProxy: false };
}

function scoreNicotine(r: QuestionnaireResponse): Pick<Le8DomainScore, 'score' | 'message' | 'isProxy'> {
  const estado = getAnswer(r, 'tabaco_estado') as string | undefined;
  const pasiva = getAnswer(r, 'exposicion_pasiva') as boolean | undefined;

  const baseScore: Record<string, number> = {
    'never':         100,
    'quit_5plus':    100,
    'quit_1_5':       75,
    'quit_less_1':    50,
    'current_light':  25,
    'current_heavy':   0,
    'vape':           25,
  };

  let score = baseScore[estado ?? 'never'] ?? 75;

  if ((estado === 'never' || estado === 'quit_5plus') && pasiva === true) {
    score = Math.max(0, score - 15);
  }

  const messages: Record<string, string> = {
    optimal:      'Excelente — no fumar es la mejor decisión para tu corazón.',
    intermediate: 'Cada día sin fumar tu corazón se recupera. Vale la pena seguir.',
    inadequate:   'Dejar de fumar duplica el beneficio de cualquier otra medida. Te podemos acompañar.',
  };

  return { score, message: messages[levelFromScore(score)], isProxy: false };
}

function scoreSleep(r: QuestionnaireResponse): Pick<Le8DomainScore, 'score' | 'message' | 'isProxy'> {
  const horas = getAnswer(r, 'horas_sueno') as string | undefined;
  const calidad = getAnswer(r, 'calidad_sueno') as string | undefined;
  const sofocos = getAnswer(r, 'sofocos_nocturnos') as boolean | undefined;
  const apnea = getAnswer(r, 'apnea_diagnosticada') as boolean | undefined;

  const horasScore: Record<string, number> = {
    'less_5': 0, '5_6': 50, '7_9': 100, 'more_9': 60,
  };
  const calidadScore: Record<string, number> = {
    'very_good': 100, 'good': 75, 'fair': 40, 'poor': 10,
  };

  const h = horasScore[horas ?? ''] ?? 50;
  const c = calidadScore[calidad ?? ''] ?? 50;
  let score = Math.round((h * 0.6) + (c * 0.4));

  if (sofocos === true) score = Math.max(0, score - 10);
  if (apnea === true) score = Math.max(0, score - 15);

  const messages: Record<string, string> = {
    optimal:      'Tu sueño es una fortaleza. Mantenerlo es parte del plan.',
    intermediate: 'Mejorar el sueño alivia síntomas de menopausia y protege tu corazón.',
    inadequate:   'El sueño es medicina. Los sofocos y el estrés hormomal lo afectan — podemos trabajarlo.',
  };

  return { score, message: messages[levelFromScore(score)], isProxy: false };
}

function scoreBodyWeight(r: QuestionnaireResponse): Pick<Le8DomainScore, 'score' | 'message' | 'isProxy'> {
  const peso = getAnswer(r, 'peso_kg') as number | undefined;
  const talla = getAnswer(r, 'talla_cm') as number | undefined;
  const cintura = getAnswer(r, 'cintura_cm') as number | undefined;
  const autoReport = getAnswer(r, 'peso_autoreporte') as string | undefined;

  let score: number;
  let isProxy = false;

  if (peso && talla && talla > 0) {
    const bmi = peso / Math.pow(talla / 100, 2);

    let bmiScore: number;
    if (bmi < 18.5) bmiScore = 70;
    else if (bmi < 25) bmiScore = 100;
    else if (bmi < 30) bmiScore = 70;
    else if (bmi < 35) bmiScore = 45;
    else if (bmi < 40) bmiScore = 20;
    else bmiScore = 0;

    // Ajuste por cintura (riesgo abdominal específico de menopausia)
    // Riesgo alto: cintura > 88 cm en mujeres
    let cinturaScore = bmiScore;
    if (cintura !== undefined) {
      if (cintura > 88) cinturaScore = Math.max(0, bmiScore - 15);
      else if (cintura > 80) cinturaScore = Math.max(0, bmiScore - 5);
    }

    score = cinturaScore;
  } else if (autoReport && autoReport !== 'prefer_not') {
    const proxyScore: Record<string, number> = {
      'normal': 90, 'overweight': 65, 'obese': 30, 'underweight': 70,
    };
    score = proxyScore[autoReport] ?? 50;
    isProxy = true;
  } else {
    score = 50; // No hay dato — score neutral
    isProxy = true;
  }

  const messages: Record<string, string> = {
    optimal:      'Tu peso está en zona saludable para tu corazón.',
    intermediate: 'La menopausia redistribuye la grasa hacia el abdomen — trabajarlo es clave.',
    inadequate:   'Reducir el peso abdominal es la prioridad. Pequeños cambios tienen gran impacto.',
  };

  return { score, message: messages[levelFromScore(score)], isProxy };
}

function scoreBloodLipids(r: QuestionnaireResponse): Pick<Le8DomainScore, 'score' | 'message' | 'isProxy'> {
  const tieneResultado = getAnswer(r, 'tiene_colesterol_reciente') as boolean | undefined;
  const colTotal = getAnswer(r, 'colesterol_total') as number | undefined;
  const colLdl = getAnswer(r, 'colesterol_ldl') as number | undefined;
  const diagnostico = getAnswer(r, 'diagnostico_colesterol') as boolean | undefined;
  const medicacion = getAnswer(r, 'medicacion_colesterol') as boolean | undefined;

  let score: number;
  let isProxy = false;

  if (tieneResultado === true && colTotal) {
    // Score basado en colesterol total (AHA 2022)
    let base: number;
    if (colTotal < 200) base = 100;
    else if (colTotal < 240) base = 65;
    else base = 30;

    // Si también tiene LDL
    if (colLdl) {
      let ldlScore: number;
      if (colLdl < 100) ldlScore = 100;
      else if (colLdl < 130) ldlScore = 75;
      else if (colLdl < 160) ldlScore = 50;
      else ldlScore = 25;
      base = Math.round((base + ldlScore) / 2);
    }

    // Medicación: si está controlada con medicación, score intermedio
    if (medicacion === true && base < 60) base = Math.min(base + 20, 70);

    score = base;
  } else if (tieneResultado === false) {
    if (diagnostico === true) {
      score = medicacion === true ? 50 : 25;
    } else {
      score = 70; // Sin diagnóstico previo → proxy razonablemente positivo
    }
    isProxy = true;
  } else {
    score = 60;
    isProxy = true;
  }

  const messages: Record<string, string> = {
    optimal:      'Tus lípidos están en zona óptima. Los estrógenos ya no te protegen — mantenerlos es tu trabajo.',
    intermediate: 'El colesterol sube en la menopausia. Alimentación y ejercicio son las primeras medidas.',
    inadequate:   'El colesterol alto es silencioso y muy tratable. El Plan 100 Días® te puede ayudar.',
  };

  return { score, message: messages[levelFromScore(score)], isProxy };
}

function scoreBloodGlucose(r: QuestionnaireResponse): Pick<Le8DomainScore, 'score' | 'message' | 'isProxy'> {
  const tieneResultado = getAnswer(r, 'tiene_glucemia_reciente') as boolean | undefined;
  const glucosa = getAnswer(r, 'glucosa_ayunas') as number | undefined;
  const hba1c = getAnswer(r, 'hba1c') as number | undefined;
  const diagnostico = getAnswer(r, 'diagnostico_diabetes') as string | undefined;
  const medicacion = getAnswer(r, 'medicacion_diabetes') as boolean | undefined;

  let score: number;
  let isProxy = false;

  if (tieneResultado === true && glucosa) {
    let base: number;
    if (glucosa < 100) base = 100;
    else if (glucosa < 126) base = 65; // prediabetes range
    else base = 30;

    if (hba1c) {
      let hba1cScore: number;
      if (hba1c < 5.7) hba1cScore = 100;
      else if (hba1c < 6.5) hba1cScore = 65;
      else hba1cScore = 30;
      base = Math.round((base + hba1cScore) / 2);
    }

    if (medicacion === true && base < 50) base = Math.min(base + 15, 60);

    score = base;
  } else if (tieneResultado === false || tieneResultado === undefined) {
    const proxyScore: Record<string, number> = {
      'no': 80, 'prediabetes': 50, 'diabetes_t2': 25, 'not_sure': 60,
    };
    score = proxyScore[diagnostico ?? 'no'] ?? 70;
    if (medicacion === true && score < 50) score = Math.min(score + 15, 60);
    isProxy = true;
  } else {
    score = 65;
    isProxy = true;
  }

  const messages: Record<string, string> = {
    optimal:      'Tu glucosa está en zona óptima. La menopausia aumenta la resistencia a la insulina — seguí atentas.',
    intermediate: 'La prediabetes es reversible. Actividad y alimentación son las herramientas más potentes.',
    inadequate:   'Controlar la glucosa protege tu corazón, riñones y visión. El plan puede ayudarte.',
  };

  return { score, message: messages[levelFromScore(score)], isProxy };
}

function scoreBloodPressure(r: QuestionnaireResponse): Pick<Le8DomainScore, 'score' | 'message' | 'isProxy'> {
  const conoce = getAnswer(r, 'conoce_presion') as boolean | undefined;
  const sistolica = getAnswer(r, 'presion_sistolica') as number | undefined;
  const diastolica = getAnswer(r, 'presion_diastolica') as number | undefined;
  const diagnostico = getAnswer(r, 'diagnostico_hta') as boolean | undefined;
  const medicacion = getAnswer(r, 'medicacion_hta') as boolean | undefined;

  let score: number;
  let isProxy = false;

  if (conoce === true && sistolica) {
    let base: number;
    const d = diastolica ?? 80;

    if (sistolica < 120 && d < 80) base = 100;
    else if (sistolica < 130 && d < 80) base = 80;
    else if (sistolica < 140 || d < 90) base = 55;
    else if (sistolica < 160 || d < 100) base = 30;
    else base = 0;

    if (medicacion === true && base < 60) base = Math.min(base + 20, 70);

    score = base;
  } else {
    if (diagnostico === true) {
      score = medicacion === true ? 50 : 20;
    } else {
      score = 75;
    }
    isProxy = true;
  }

  const messages: Record<string, string> = {
    optimal:      'Tu presión arterial está en zona óptima. Seguí controlándola anualmente.',
    intermediate: 'La presión alta en la menopausia es muy común y muy tratable. Vale la pena actuar.',
    inadequate:   'La hipertensión es el factor de riesgo más importante en mujeres post-menopáusicas. Podemos ayudarte.',
  };

  return { score, message: messages[levelFromScore(score)], isProxy };
}

// ── Función principal ─────────────────────────────────────────────────────────

/**
 * Calcula el score LE8 completo a partir de un QuestionnaireResponse.
 * Retorna scores por dominio + score global + dominios prioritarios para el Plan 100 Días®.
 */
export function calculateLe8Score(response: QuestionnaireResponse): Le8Score {
  const domainDefs: {
    domain: Le8Domain;
    label: string;
    fn: (r: QuestionnaireResponse) => Pick<Le8DomainScore, 'score' | 'message' | 'isProxy'>;
  }[] = [
    { domain: 'diet',            label: 'Alimentación',      fn: scoreDiet },
    { domain: 'physical_activity', label: 'Actividad Física', fn: scorePhysicalActivity },
    { domain: 'nicotine',        label: 'Tabaco / Nicotina',  fn: scoreNicotine },
    { domain: 'sleep',           label: 'Sueño',              fn: scoreSleep },
    { domain: 'body_weight',     label: 'Peso Corporal',      fn: scoreBodyWeight },
    { domain: 'blood_lipids',    label: 'Colesterol',         fn: scoreBloodLipids },
    { domain: 'blood_glucose',   label: 'Glucemia',           fn: scoreBloodGlucose },
    { domain: 'blood_pressure',  label: 'Presión Arterial',   fn: scoreBloodPressure },
  ];

  const domains: Le8DomainScore[] = domainDefs.map(({ domain, label, fn }) => {
    const { score, message, isProxy } = fn(response);
    return { domain, label, score, level: levelFromScore(score), message, isProxy };
  });

  const global = Math.round(
    domains.reduce((sum, d) => sum + d.score, 0) / domains.length
  );

  // Los 2 dominios con menor score = foco del Plan 100 Días®
  const priorityDomains = [...domains]
    .sort((a, b) => a.score - b.score)
    .slice(0, 2)
    .map((d) => d.domain);

  return {
    global,
    globalLevel: levelFromScore(global),
    domains,
    priorityDomains,
    assessedAt: new Date(),
  };
}

/**
 * Texto descriptivo del score global para mostrar en la pantalla de resultado.
 */
export function globalScoreMessage(score: Le8Score): string {
  if (score.global >= 80) {
    return (
      '¡Tu corazón está en buena forma! ' +
      'Tu score LE8 es alto. Seguí con los hábitos que ya tenés ' +
      'y usá el Plan 100 Días® para consolidar lo que falta.'
    );
  }
  if (score.global >= 50) {
    return (
      'Tu salud cardiovascular tiene una base sólida con áreas de mejora. ' +
      'El Plan 100 Días® va a focalizarse en las zonas donde más podés crecer.'
    );
  }
  return (
    'Este es tu punto de partida — y es el momento ideal para actuar. ' +
    'La menopausia es una ventana de oportunidad para transformar tu salud cardiovascular. ' +
    'El Plan 100 Días® fue diseñado exactamente para esto.'
  );
}

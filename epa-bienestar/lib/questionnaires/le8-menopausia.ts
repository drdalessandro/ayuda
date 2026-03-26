/**
 * EPA Bienestar — Evaluación Inicial Life's Essential 8
 * Módulo: Menopausia
 *
 * Framework clínico: Life's Essential 8 (AHA 2022)
 * Contexto: Mujer en perimenopausia / menopausia (45–60 años)
 * Idioma: Español neutro LatAm
 *
 * Estructura: 8 bloques (uno por esencial), conversacional.
 * Las preguntas de laboratorio se muestran condicionalmente
 * según si la usuaria tiene resultados recientes.
 */

import { QuestionnaireBuilder, enableWhen } from '@spezivibe/questionnaire';
import type { Questionnaire } from '@spezivibe/questionnaire';

export const LE8_MENOPAUSIA_ID = 'le8-menopausia-v1';

export const LE8_MENOPAUSIA_QUESTIONNAIRE: Questionnaire = new QuestionnaireBuilder(LE8_MENOPAUSIA_ID)
  .title('Evaluación Inicial — Life\'s Essential 8')
  .description(
    'Esta evaluación nos permite conocer tu estado cardiovascular actual ' +
    'según los 8 esenciales de la American Heart Association. ' +
    'Tarda aproximadamente 5 minutos. ' +
    'Podés responder con lo que sepas — si no tenés un dato, te ayudamos igual.'
  )
  .version('1.0.0')

  // ── Contexto de vida ──────────────────────────────────────────────────────

  .addDisplay(
    'intro-menopausia',
    '💜 Estamos aquí para acompañarte. La menopausia es una etapa de vida — ' +
    'no una enfermedad — pero sí es el momento en que el riesgo cardiovascular ' +
    'de la mujer aumenta. Esta evaluación es el primer paso para cuidar tu corazón.'
  )

  .addChoice('etapa_reproductiva', '¿En qué etapa te encontrás actualmente?', {
    required: true,
    answerOption: [
      { value: 'perimenopause', display: 'Perimenopausia (ciclos irregulares, síntomas)' },
      { value: 'menopause_recent', display: 'Menopausia reciente (último período hace menos de 2 años)' },
      { value: 'menopause_established', display: 'Menopausia establecida (más de 2 años sin período)' },
      { value: 'surgical', display: 'Menopausia quirúrgica (extirpación de ovarios)' },
      { value: 'not_sure', display: 'No estoy segura' },
    ],
  })

  // ── Bloque 1: Alimentación ────────────────────────────────────────────────

  .addDisplay(
    'titulo-alimentacion',
    '🥗 Bloque 1 de 8 — Alimentación\n' +
    'Una alimentación saludable protege tu corazón y ayuda a manejar los cambios hormonales.'
  )

  .addChoice('frutas_verduras', '¿Cuántas porciones de frutas y verduras comés por día? (1 porción = 1 fruta mediana o ½ taza de verduras)', {
    required: true,
    answerOption: [
      { value: '0', display: 'Casi ninguna (0–1 porción)' },
      { value: '2', display: '2–3 porciones' },
      { value: '4', display: '4–5 porciones' },
      { value: '5plus', display: '5 o más porciones' },
    ],
  })

  .addChoice('ultraprocesados', '¿Con qué frecuencia consumís alimentos ultraprocesados? (galletitas, fiambres, snacks envasados, gaseosas, comida rápida)', {
    required: true,
    answerOption: [
      { value: 'daily', display: 'Todos los días' },
      { value: 'frequent', display: '4–6 veces por semana' },
      { value: 'occasional', display: '1–3 veces por semana' },
      { value: 'rare', display: 'Rara vez o nunca' },
    ],
  })

  .addChoice('sodio', '¿Agregás sal a la comida ya servida o consumís alimentos muy salados?', {
    required: true,
    answerOption: [
      { value: 'always', display: 'Siempre o casi siempre' },
      { value: 'sometimes', display: 'A veces' },
      { value: 'rarely', display: 'Rara vez o nunca' },
    ],
  })

  // ── Bloque 2: Actividad Física ────────────────────────────────────────────

  .addDisplay(
    'titulo-actividad',
    '🚶‍♀️ Bloque 2 de 8 — Actividad Física\n' +
    'Moverse regularmente reduce el riesgo cardiovascular y alivia síntomas como ' +
    'los sofocos y los cambios de ánimo propios de la menopausia.'
  )

  .addChoice('actividad_moderada', '¿Cuántos minutos por semana hacés actividad física moderada? (caminar rápido, andar en bici, bailar, nadar a ritmo suave)', {
    required: true,
    answerOption: [
      { value: '0', display: 'Ninguno' },
      { value: '1_59', display: '1–59 minutos' },
      { value: '60_119', display: '60–119 minutos' },
      { value: '120_149', display: '120–149 minutos' },
      { value: '150plus', display: '150 minutos o más (objetivo ideal)' },
    ],
  })

  .addChoice('actividad_intensa', '¿Hacés alguna actividad intensa? (correr, aeróbica intensa, pesas, deportes)', {
    required: true,
    answerOption: [
      { value: 'no', display: 'No' },
      { value: '1_74', display: 'Sí, menos de 75 minutos por semana' },
      { value: '75plus', display: 'Sí, 75 minutos o más por semana' },
    ],
  })

  .addBoolean('sedentarismo_prolongado', '¿Pasás más de 8 horas al día sentada o sin moverte? (trabajo de escritorio, TV, descanso)', {
    required: true,
  })

  // ── Bloque 3: Tabaco y Nicotina ───────────────────────────────────────────

  .addDisplay(
    'titulo-tabaco',
    '🚭 Bloque 3 de 8 — Tabaco y Nicotina\n' +
    'El tabaco acelera la menopausia y multiplica el riesgo cardiovascular. ' +
    'Si dejaste de fumar, eso ya es un logro enorme para tu corazón.'
  )

  .addChoice('tabaco_estado', '¿Cuál es tu situación actual con el tabaco o la nicotina?', {
    required: true,
    answerOption: [
      { value: 'never', display: 'Nunca fumé' },
      { value: 'quit_5plus', display: 'Dejé hace más de 5 años' },
      { value: 'quit_1_5', display: 'Dejé hace 1–5 años' },
      { value: 'quit_less_1', display: 'Dejé hace menos de 1 año' },
      { value: 'current_light', display: 'Fumo actualmente (menos de 10 cigarrillos/día)' },
      { value: 'current_heavy', display: 'Fumo actualmente (10 o más cigarrillos/día)' },
      { value: 'vape', display: 'Uso cigarrillo electrónico / vapeador' },
    ],
  })

  .addBoolean(
    'exposicion_pasiva',
    '¿Estás expuesta frecuentemente al humo de tabaco de otras personas?',
    {
      required: true,
      enableWhen: [enableWhen('tabaco_estado', '=', { code: 'never' })],
    }
  )

  // ── Bloque 4: Sueño ───────────────────────────────────────────────────────

  .addDisplay(
    'titulo-sueno',
    '😴 Bloque 4 de 8 — Sueño\n' +
    'Los sofocos nocturnos y los cambios hormonales de la menopausia afectan ' +
    'la calidad del sueño. Dormir bien es fundamental para el corazón.'
  )

  .addChoice('horas_sueno', '¿Cuántas horas dormís por noche en promedio?', {
    required: true,
    answerOption: [
      { value: 'less_5', display: 'Menos de 5 horas' },
      { value: '5_6', display: '5–6 horas' },
      { value: '7_9', display: '7–9 horas (ideal)' },
      { value: 'more_9', display: 'Más de 9 horas' },
    ],
  })

  .addChoice('calidad_sueno', '¿Cómo calificarías la calidad de tu sueño en general?', {
    required: true,
    answerOption: [
      { value: 'very_good', display: 'Muy buena — descanso bien todas las noches' },
      { value: 'good', display: 'Buena — descanso la mayoría de las noches' },
      { value: 'fair', display: 'Regular — me despierto seguido' },
      { value: 'poor', display: 'Mala — rara vez descanso bien' },
    ],
  })

  .addBoolean(
    'sofocos_nocturnos',
    '¿Los sofocos o sudoraciones nocturnas interrumpen tu sueño?',
    { required: true }
  )

  .addBoolean(
    'apnea_diagnosticada',
    '¿Te diagnosticaron apnea del sueño o te dijeron que roncás fuertemente?',
    { required: false }
  )

  // ── Bloque 5: Peso Corporal ───────────────────────────────────────────────

  .addDisplay(
    'titulo-peso',
    '⚖️ Bloque 5 de 8 — Peso Corporal\n' +
    'Durante la menopausia, la distribución de grasa cambia hacia la zona abdominal. ' +
    'Eso aumenta el riesgo cardiovascular, independientemente del peso total.'
  )

  .addDecimal('peso_kg', '¿Cuánto pesás aproximadamente? (en kg, ej: 72.5)', {
    required: false,
    min: 30,
    max: 250,
  })

  .addDecimal('talla_cm', '¿Cuánto medís? (en cm, ej: 162)', {
    required: false,
    min: 130,
    max: 220,
  })

  .addDecimal('cintura_cm', '¿Sabés cuánto medís de cintura? (en cm, ej: 88) — medida a la altura del ombligo', {
    required: false,
    min: 50,
    max: 200,
  })

  .addChoice('peso_autoreporte', 'Si no sabés tu peso exacto, ¿cómo describirías tu peso corporal?', {
    required: false,
    answerOption: [
      { value: 'normal', display: 'Peso normal para mi altura' },
      { value: 'overweight', display: 'Algo de sobrepeso' },
      { value: 'obese', display: 'Obesidad' },
      { value: 'underweight', display: 'Bajo peso' },
      { value: 'prefer_not', display: 'Prefiero no responder' },
    ],
  })

  // ── Bloque 6: Colesterol / Lípidos ───────────────────────────────────────

  .addDisplay(
    'titulo-colesterol',
    '🩸 Bloque 6 de 8 — Colesterol\n' +
    'Los estrógenos protegen el corazón. Al bajar en la menopausia, ' +
    'el colesterol LDL (malo) suele subir. Es importante controlarlo.'
  )

  .addBoolean('tiene_colesterol_reciente', '¿Tenés un resultado de colesterol en los últimos 12 meses?', {
    required: true,
  })

  .addInteger(
    'colesterol_total',
    '¿Cuál fue tu colesterol total? (mg/dL, ej: 195)',
    {
      required: false,
      min: 100,
      max: 500,
      enableWhen: [enableWhen('tiene_colesterol_reciente', '=', true)],
    }
  )

  .addInteger(
    'colesterol_ldl',
    '¿Sabés tu colesterol LDL ("malo")? (mg/dL, ej: 120) — podés dejar en blanco si no lo sabés',
    {
      required: false,
      min: 30,
      max: 400,
      enableWhen: [enableWhen('tiene_colesterol_reciente', '=', true)],
    }
  )

  .addBoolean(
    'diagnostico_colesterol',
    '¿Alguna vez te dijeron que tenés el colesterol alto?',
    {
      required: true,
      enableWhen: [enableWhen('tiene_colesterol_reciente', '=', false)],
    }
  )

  .addBoolean(
    'medicacion_colesterol',
    '¿Tomás medicación para el colesterol (estatinas u otros)?',
    { required: true }
  )

  // ── Bloque 7: Glucemia / Diabetes ─────────────────────────────────────────

  .addDisplay(
    'titulo-glucemia',
    '🍬 Bloque 7 de 8 — Glucemia\n' +
    'La resistencia a la insulina aumenta después de la menopausia. ' +
    'Controlar la glucosa es clave para prevenir diabetes y proteger el corazón.'
  )

  .addBoolean('tiene_glucemia_reciente', '¿Tenés un resultado de glucosa en ayunas en los últimos 12 meses?', {
    required: true,
  })

  .addInteger(
    'glucosa_ayunas',
    '¿Cuál fue tu glucosa en ayunas? (mg/dL, ej: 95)',
    {
      required: false,
      min: 50,
      max: 500,
      enableWhen: [enableWhen('tiene_glucemia_reciente', '=', true)],
    }
  )

  .addDecimal(
    'hba1c',
    '¿Sabés tu HbA1c (hemoglobina glicosilada)? (%, ej: 5.4) — podés dejar en blanco si no lo sabés',
    {
      required: false,
      min: 3,
      max: 15,
      enableWhen: [enableWhen('tiene_glucemia_reciente', '=', true)],
    }
  )

  .addChoice(
    'diagnostico_diabetes',
    '¿Te diagnosticaron alguna vez diabetes o prediabetes?',
    {
      required: true,
      enableWhen: [enableWhen('tiene_glucemia_reciente', '=', false)],
      answerOption: [
        { value: 'no', display: 'No, nunca' },
        { value: 'prediabetes', display: 'Sí, prediabetes' },
        { value: 'diabetes_t2', display: 'Sí, diabetes tipo 2' },
        { value: 'not_sure', display: 'No estoy segura' },
      ],
    }
  )

  .addBoolean(
    'medicacion_diabetes',
    '¿Tomás medicación para la diabetes o prediabetes?',
    { required: false }
  )

  // ── Bloque 8: Presión Arterial ────────────────────────────────────────────

  .addDisplay(
    'titulo-presion',
    '🫀 Bloque 8 de 8 — Presión Arterial\n' +
    'La presión alta es el factor de riesgo cardiovascular más importante ' +
    'en mujeres después de la menopausia, y con frecuencia no da síntomas.'
  )

  .addBoolean('conoce_presion', '¿Sabés cuál es tu presión arterial habitual?', {
    required: true,
  })

  .addInteger(
    'presion_sistolica',
    '¿Cuál fue tu última presión sistólica (el número de arriba)? (mmHg, ej: 122)',
    {
      required: false,
      min: 60,
      max: 250,
      enableWhen: [enableWhen('conoce_presion', '=', true)],
    }
  )

  .addInteger(
    'presion_diastolica',
    '¿Cuál fue tu última presión diastólica (el número de abajo)? (mmHg, ej: 78)',
    {
      required: false,
      min: 40,
      max: 150,
      enableWhen: [enableWhen('conoce_presion', '=', true)],
    }
  )

  .addBoolean(
    'diagnostico_hta',
    '¿Te diagnosticaron hipertensión arterial?',
    {
      required: true,
      enableWhen: [enableWhen('conoce_presion', '=', false)],
    }
  )

  .addBoolean(
    'medicacion_hta',
    '¿Tomás medicación para la presión arterial?',
    { required: true }
  )

  // ── Cierre ────────────────────────────────────────────────────────────────

  .addDisplay(
    'cierre',
    '✅ ¡Completaste la evaluación!\n\n' +
    'En un momento vas a ver tu score LE8 con las 8 áreas de tu salud cardiovascular. ' +
    'Recordá: no hay respuestas malas, solo información que nos ayuda a acompañarte mejor.\n\n' +
    '— Dr. Alejandro Sergio D\'Alessandro y el equipo EPA Bienestar'
  )

  .build();

# UX Planning Brief — EPA Bienestar
## Salud Cardiovascular de la Mujer · FemTech LatAm
### Módulo Prioritario: Menopausia
**Versión:** 1.0 · **Fecha:** 2026-03-26
**Marca registrada:** Plan Bienestar 100 Días® — Dr. Alejandro Sergio D'Alessandro
**Framework clínico:** Life's Essential 8 (AHA) · Go Red For Women
**Backend:** Medplum FHIR R4 — https://api.epa-bienestar.com.ar

---

## 1. Segmentos de Usuaria

### Usuaria Primaria (MVP — Fase Menopausia)

| Perfil | Descripción |
|---|---|
| **Mujer en perimenopausia / menopausia** | 45–60 años, LatAm y comunidad Latina en el sur de EE.UU. |
| Contexto cultural | Alta influencia familiar, posible barrera idiomática (español dominante o lengua materna), confianza en recomendación médica directa |
| Momento de vida | Cambios hormonales activos, síntomas no reconocidos como cardiovasculares, alta carga doméstica/laboral |
| Relación con la salud | Subdefinición propia del riesgo cardiovascular; "eso es de hombres" — sesgo cultural arraigado |
| Acceso tecnológico | Smartphone (mayoría Android de gama media), datos móviles limitados, baja tolerancia a apps complejas |
| Alfabetización en salud | Media-baja para terminología clínica; alta receptividad a lenguaje cercano, cálido y con respaldo médico visible |

### Usuarias Futuras (siguientes fases del roadmap)

| Segmento | Etapa de vida |
|---|---|
| Mujer en desarrollo académico/profesional | 20–35 años |
| Mujer en gestación | Embarazo y postparto |
| Mujer +65 | Riesgo cardiovascular consolidado |

### Usuarias Secundarias / Roles de Apoyo

- **Médica/médico de cabecera o ginecólogo/a:** recibe resumen del score LE8, no opera la app
- **Equipo EPA (Dr. D'Alessandro y staff):** monitoreo de adherencia, ajuste del Plan 100 Días
- **Familiar/acompañante de confianza:** puede recibir recordatorios con consentimiento explícito

---

## 2. Jobs To Be Done Principales

| # | Job | Motivación real |
|---|---|---|
| 1 | Entender si mi corazón está en riesgo | "Nadie me lo había dicho así" |
| 2 | Ver qué cosas concretas puedo cambiar hoy | Agencia, no solo diagnóstico |
| 3 | Tener un plan que se adapte a mi vida real | No más dietas de revista |
| 4 | Sentirme acompañada por alguien que me entiende | Confianza cultural y de género |
| 5 | Llevarle algo concreto a mi médica/o | Legitimidad clínica del score |

---

## 3. Journeys Principales

### Journey A — Descubrir y Hacer la Evaluación Inicial

```
[Punto de entrada]
  └─ Invitación (WhatsApp / redes / médica/o referente)
       └─ Landing de bienvenida EPA
            ├─ ¿Qué es el riesgo cardiovascular en la menopausia?
            │    (3 datos impactantes, lenguaje llano, 30 seg de lectura)
            └─ CTA principal: "Conocé tu score LE8 — es gratis y tarda 5 minutos"
                 └─ Registro mínimo (nombre, email o WhatsApp, año de nacimiento)
                      └─ EVALUACIÓN INICIAL (ver Journey B)
```

### Journey B — Evaluación Inicial Life's Essential 8

El flujo es conversacional, una pregunta visible a la vez, con barra de progreso.

```
Bloque 1 — Alimentación
  └─ ¿Con qué frecuencia comés frutas y verduras? / ¿Comés ultraprocesados?

Bloque 2 — Actividad Física
  └─ ¿Cuántos minutos caminás o te movés por día?

Bloque 3 — Tabaco / Nicotina
  └─ ¿Fumás o usás cigarrillo electrónico? ¿Cuánto?

Bloque 4 — Sueño
  └─ ¿Cuántas horas dormís por noche? ¿Despertás seguido?
  └─ [Nota contextual: el insomnio es síntoma frecuente de menopausia]

Bloque 5 — Peso Corporal
  └─ Talla y peso (auto-reporte) → cálculo de IMC silencioso

Bloque 6 — Colesterol
  └─ ¿Tenés análisis recientes? ¿Te dijeron que tenés colesterol alto?

Bloque 7 — Glucemia / Diabetes
  └─ ¿Tenés diabetes o prediabetes? ¿Cuándo fue tu último análisis?

Bloque 8 — Presión Arterial
  └─ ¿Sabés tu presión? ¿Tomás medicación para la presión?
```

**Resultado: Score LE8 (0–100)**

```
[Pantalla de Score]
  ├─ Visualización radar / semáforo de los 8 ejes
  ├─ Lenguaje positivo: "Tus fortalezas" + "Tus oportunidades"
  ├─ Mensaje firmado: Dr. Alejandro D'Alessandro (confianza)
  └─ CTA: "Iniciá tu Plan Bienestar 100 Días®"
```

**Datos FHIR generados:**
- `QuestionnaireResponse` — respuestas LE8
- `Observation` — score por dominio + score global
- `RiskAssessment` — riesgo cardiovascular calculado
- `Patient` — perfil mínimo

### Journey C — Ingreso al Plan Bienestar 100 Días®

```
[Día 1]
  ├─ Presentación del plan: qué esperar en 100 días
  ├─ Foco semanal basado en las 2 áreas con score más bajo
  ├─ Primera micro-acción del día (≤ 2 minutos para completar)
  └─ Notificación de bienvenida personalizada

[Semana 1–4: Establecer hábitos]
  ├─ 1 acción diaria por área prioritaria
  ├─ Check-in semanal (3 preguntas, 90 seg)
  └─ Actualización visual del score parcial

[Semana 5–12: Consolidar y revisar]
  ├─ Re-evaluación LE8 en día 50
  ├─ Ajuste del plan con nuevo score
  └─ Contenido educativo contextual (menopausia + corazón)

[Día 100: Cierre]
  ├─ Score final LE8
  ├─ Comparativo inicial vs. final
  ├─ Certificado de participación (PDF descargable)
  └─ CTA: "Compartí tu resultado con tu médica/o" (FHIR summary exportable)
```

### Journey D — Recuperación / Caída en adherencia

```
[Detección: 3 días sin actividad]
  └─ Mensaje WhatsApp o push: "¿Cómo estás?" — sin culpa, con apertura
       ├─ Opción A: "Retomé" → lleva al punto donde quedó
       └─ Opción B: "Necesito pausa" → marca pausa voluntaria, no penaliza score
```

---

## 4. Estrategia de Onboarding

**Principio rector:** Generar confianza antes de pedir datos.

### Pantalla 0 — Por qué importa (pre-registro)
- Dato estadístico impactante en español simple:
  *"El infarto es la principal causa de muerte de mujeres en LatAm. En la menopausia, el riesgo se duplica. Nadie te lo había dicho así."*
- Logo Go Red For Women + aval del Dr. D'Alessandro
- Sin formulario todavía

### Pantalla 1 — Registro mínimo
- Solo: nombre (o apodo), WhatsApp o email, año de nacimiento
- Texto de privacidad: "Tus datos son tuyos. Nunca los vendemos."
- NO pedir: CUIL, dirección, obra social en este paso

### Pantalla 2 — Orientación rápida (30 seg)
- Qué es LE8 en 3 íconos simples
- Qué es el Plan 100 Días® en 1 oración
- "Empezá la evaluación →" — acción inmediata de valor

### Regla de oro del onboarding
> No pedir ningún permiso (cámara, notificaciones, ubicación) antes de que la usuaria haya completado la Evaluación Inicial y visto su score. Ese momento de valor crea el deseo de querer más.

---

## 5. Flujo Recurrente — Día a Día en el Plan 100 Días®

### Qué trae a la usuaria de vuelta
- Notificación diaria contextual (WhatsApp preferido sobre push nativo — ecosistema LatAm)
- Recordatorio con nombre y micro-frase motivacional cultural
- Contexto de menopausia integrado: *"¿Dormiste mejor esta noche?"*

### Qué ve primero al abrir
- Día N de 100 (barra de progreso visible, nunca oculta)
- Acción del día — una sola, clara, alcanzable
- Score LE8 actual (actualizado cada semana)

### Comunicación de progreso
- "Completaste 7 días seguidos" — sin gamificación agresiva
- Comparativa suave: "Esta semana dormiste 30 min más que la semana pasada"
- Evitar: puntos, rankings, badges — generan ansiedad en este segmento

### Cuando la usuaria se pierde o falta
- Sin mensaje de "fallaste"
- Mensaje cálido: *"La vida pasa. Seguimos desde acá."*
- Retoma desde el día actual, no desde el día que faltó

---

## 6. Estrategia de Engagement

| Principio | Implementación |
|---|---|
| Canal preferido: WhatsApp | Notificaciones por WA Business API (no push nativo como principal) |
| Frecuencia sostenible | 1 mensaje diario máximo; opcionales los fines de semana |
| Voz y tono | Cálido, directo, femenino y culturalmente LatAm. No médico-frío. |
| Hitos motivacionales | Días 7, 14, 30, 50, 75, 100 — mensaje especial del Dr. D'Alessandro |
| Resumen semanal | Domingo: "Tu semana en 3 puntos" — PDF/imagen compartible |
| Comunidad (fase 2) | Grupo de pares opt-in — mujeres en el mismo tramo del plan |
| Evitar | Shame por incumplimiento, comparaciones públicas, alertas excesivas |

---

## 7. Accesibilidad e Inclusión

### Idioma y alfabetización
- Español neutro LatAm con variantes regionales (Argentina, México, Colombia, comunidad latina EE.UU.)
- Nivel de lectura objetivo: 6° grado — sin tecnicismos sin explicar
- Glosario inline: tocar un término médico lo explica en lenguaje simple
- Futura fase: soporte bilingüe español/inglés para comunidad latina EE.UU.

### Visual y cognitivo
- Fuente mínima 16px en móvil
- Contraste WCAG AA como mínimo
- Íconos + texto siempre (no solo color para comunicar estado)
- Una sola acción por pantalla — evitar sobrecarga cognitiva
- Progreso siempre visible — reduce ansiedad

### Confianza cultural
- Foto y nombre del Dr. D'Alessandro en momentos clave (no solo en el footer)
- Testimonios reales de mujeres del mismo segmento (con consentimiento)
- Aval Go Red For Women visible en onboarding y en score
- Evitar imágenes de cuerpos "ideales" — usar ilustraciones diversas

### Conectividad
- Diseño offline-first para la Evaluación Inicial: las respuestas se guardan localmente y sincronizan al reconectar
- Imágenes optimizadas para datos móviles limitados
- Texto como alternativa a video en módulos educativos

### Privacidad y FHIR
- Consentimiento informado granular antes de almacenar datos en Medplum
- La usuaria puede exportar su historia completa en PDF (FHIR Bundle resumido)
- Opción de borrar cuenta + datos en 2 pasos

---

## 8. Integración FHIR R4 — Medplum

| Recurso FHIR | Uso |
|---|---|
| `Patient` | Perfil mínimo: nombre, fecha de nacimiento, contacto |
| `Questionnaire` | Cuestionario LE8 estructurado (8 bloques, preguntas por dominio) |
| `QuestionnaireResponse` | Respuestas de la Evaluación Inicial y re-evaluaciones |
| `Observation` | Score por dominio LE8 (0–100 por eje) + score global |
| `RiskAssessment` | Riesgo cardiovascular calculado según LE8 |
| `CarePlan` | Plan Bienestar 100 Días® — actividades diarias, metas por semana |
| `Task` | Micro-acciones diarias (completada / pendiente) |
| `DocumentReference` | Resumen exportable para médica/o tratante |

**Endpoint base:** `https://api.epa-bienestar.com.ar`
**Autenticación:** SMART on FHIR (OAuth2) — implementar para fase clínica

---

## 9. Riesgos UX y Preguntas Abiertas

| # | Riesgo / Pregunta | Prioridad |
|---|---|---|
| 1 | **Barrera de auto-reporte de peso/talla:** muchas mujeres evitan o distorsionan estos datos — ¿hacemos el BMI optativo o lo reemplazamos por circunferencia de cintura? | Alta |
| 2 | **Colesterol y glucemia sin análisis recientes:** ¿cómo manejar la ausencia de datos de laboratorio sin invalidar el score? Definir lógica de "dato desconocido" en LE8 | Alta |
| 3 | **Canal WhatsApp vs. app nativa:** ¿el flujo de Evaluación Inicial vive en la web (PWA) o en un chatbot WA? Impacto directo en UX de primer uso | Alta |
| 4 | **Segmentación por país LatAm vs. EE.UU. Latino:** diferencias regulatorias (HIPAA vs. local), moneda, y referencias culturales — ¿un solo producto o configuraciones por mercado? | Media |
| 5 | **Validación clínica del score:** ¿el algoritmo LE8 adaptado requiere aval de comité de ética o publicación antes de escalar? | Media |
| 6 | **Vínculo con médica/o tratante:** ¿cómo se comparte el score sin reemplazar la consulta? Definir flujo de derivación clínica | Media |
| 7 | **Gestión de síntomas de menopausia urgentes:** sofocos severos, depresión — ¿el plan contiene un protocolo de triaje o derivación de emergencia? | Alta |
| 8 | **Privacidad en contexto doméstico:** algunas usuarias no quieren que su pareja vea sus datos de salud en el dispositivo compartido — ¿cómo proteger la sesión? | Media |

---

## Checklist de Validación

- [x] Segmentos de usuaria identificados (MVP: menopausia; roadmap: otras etapas)
- [x] Journeys principales mapeados (Evaluación Inicial, Plan 100 Días®, recuperación)
- [x] Onboarding reducido al mínimo necesario — valor antes de datos
- [x] Flujo diario del Plan 100 Días® definido
- [x] Estrategia de engagement sin manipulación ni shame
- [x] Accesibilidad e inclusión cultural LatAm documentada
- [x] Integración FHIR R4 con Medplum especificada
- [x] Riesgos UX y preguntas abiertas documentados
- [ ] Validación con 5 mujeres del segmento menopausia (pendiente de investigación)
- [ ] Definición de canal primario: PWA web vs. chatbot WhatsApp (pendiente de decisión técnica)
- [ ] Validación clínica del algoritmo LE8 adaptado (pendiente de revisión médica)

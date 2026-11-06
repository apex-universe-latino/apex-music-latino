// Progressive profiling for the Diagnóstico de Blindaje Patrimonial.
// Visit 1 asks the 5-question ladder from the brief; return visits (and the bot) ask the
// "later touches". Everything is remembered in localStorage so nobody answers twice.
// NEVER add health questions here (preexistencias, enfermedades, peso…): underwriting
// happens with the insurer, not on the site.

export type Option = { value: string; label: string };
export type Question = { key: string; q: string; hint?: string; options: Option[] };

// Option `value`s are CUBO FRM's exact option strings (migration 062) so answers land
// without mapping; `label` is what the visitor sees.
export const VISIT1: Question[] = [
  {
    key: 'meta_blindaje',
    q: '¿Para qué quieres blindar tu patrimonio?',
    options: [
      { value: 'Mi familia', label: 'Mi familia' },
      { value: 'Mi jubilación', label: 'Mi jubilación' },
      { value: 'Educación', label: 'Educación de mis hijos' },
      { value: 'Invertir / hacer crecer mi dinero', label: 'Invertir / hacer crecer mi dinero' },
    ],
  },
  {
    key: 'tiene_seguro_vida',
    q: '¿Tienes seguro de vida hoy?',
    options: [
      { value: 'Sí, con ahorro', label: 'Sí, con ahorro' },
      { value: 'Sí, solo protección', label: 'Sí, solo protección' },
      { value: 'No', label: 'No' },
      { value: 'No sé', label: 'No sé' },
    ],
  },
  {
    key: 'donde_ahorra',
    q: '¿Dónde tienes tus ahorros hoy?',
    options: [
      { value: 'CDT / cuenta de ahorros', label: 'CDT / cuenta de ahorros' },
      { value: 'Finca raíz', label: 'Finca raíz' },
      { value: 'Acciones / fondos', label: 'Acciones / fondos' },
      { value: 'Cripto', label: 'Cripto' },
      { value: 'Aún no ahorro', label: 'Aún no ahorro' },
    ],
  },
  {
    key: 'dependientes',
    q: '¿Cuántas personas dependen de ti?',
    options: [
      { value: '0', label: 'Ninguna' },
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3+', label: '3 o más' },
    ],
  },
  {
    key: 'rango_ahorro_mensual',
    q: '¿Cuánto podrías ahorrar al mes?',
    hint: 'Pesos colombianos. Es solo un rango, no un compromiso.',
    options: [
      { value: 'Menos de 500 mil', label: 'Menos de 500 mil' },
      { value: '500 mil – 1 millón', label: '500 mil – 1 millón' },
      { value: '1 – 3 millones', label: '1 – 3 millones' },
      { value: 'Más de 3 millones', label: 'Más de 3 millones' },
    ],
  },
];

export const LATER: Question[] = [
  {
    key: 'rango_edad',
    q: '¿En qué rango de edad estás?',
    options: [
      { value: '18 a 24', label: '18 a 24' },
      { value: '25 a 34', label: '25 a 34' },
      { value: '35 a 44', label: '35 a 44' },
      { value: '45 a 54', label: '45 a 54' },
      { value: '55 o más', label: '55 o más' },
    ],
  },
  {
    key: 'ocupacion',
    q: '¿Cuál es tu ocupación?',
    options: [
      { value: 'Empleado(a)', label: 'Empleado(a)' },
      { value: 'Independiente', label: 'Independiente' },
      { value: 'Empresario(a)', label: 'Empresario(a)' },
      { value: 'Otro', label: 'Otro' },
    ],
  },
  {
    key: 'horizonte',
    q: '¿En cuánto tiempo quieres ver el resultado de tu plan?',
    options: [
      { value: '5 años', label: '5 años' },
      { value: '10 años', label: '10 años' },
      { value: '15 años o más', label: '15 años o más' },
    ],
  },
  {
    key: 'ciudad',
    q: '¿En qué ciudad vives?',
    options: [
      { value: 'Bogotá', label: 'Bogotá' },
      { value: 'Medellín', label: 'Medellín' },
      { value: 'Cali', label: 'Cali' },
      { value: 'Barranquilla', label: 'Barranquilla' },
      { value: 'Otra ciudad', label: 'Otra ciudad' },
    ],
  },
  {
    key: 'ingreso_mensual',
    q: '¿En qué rango están los ingresos mensuales de tu hogar?',
    hint: 'Un rango aproximado nos ayuda a afinar tu brecha de protección.',
    options: [
      { value: 'Menos de 3 millones', label: 'Menos de 3 millones' },
      { value: '3 – 6 millones', label: '3 – 6 millones' },
      { value: '6 – 12 millones', label: '6 – 12 millones' },
      { value: '12 – 25 millones', label: '12 – 25 millones' },
      { value: 'Más de 25 millones', label: 'Más de 25 millones' },
      { value: 'Prefiero no decir', label: 'Prefiero no decir' },
    ],
  },
  {
    key: 'interes_dolares',
    q: '¿Te interesa tener parte de tus ahorros en dólares?',
    options: [
      { value: 'Sí', label: 'Sí' },
      { value: 'Tal vez, quiero entender cómo', label: 'Tal vez, quiero entender cómo' },
      { value: 'No', label: 'No' },
    ],
  },
  {
    key: 'interes_asesoria',
    q: '¿Te gustaría una asesoría gratuita de 20 minutos con Caro?',
    options: [
      { value: 'Sí', label: 'Sí' },
      { value: 'Más adelante', label: 'Más adelante' },
      { value: 'No, gracias', label: 'No, gracias' },
    ],
  },
  {
    key: 'mejor_horario',
    q: '¿En qué horario te queda mejor una llamada de 20 minutos?',
    options: [
      { value: 'Mañana', label: 'Mañana' },
      { value: 'Mediodía', label: 'Mediodía' },
      { value: 'Tarde', label: 'Tarde' },
      { value: 'Noche', label: 'Noche' },
      { value: 'Fin de semana', label: 'Fin de semana' },
    ],
  },
];

export const ALL_QUESTIONS = [...VISIT1, ...LATER];
export const LATER_PER_VISIT = 3;

export type Contact = { nombre: string; whatsapp: string; email: string };
export type Result = { score: number; gap_cop: number; projection_cop: number };
export type Profile = {
  answers: Record<string, string>;
  contact?: Contact;
  submitted_at?: string;
  result?: Result;
  marketing?: boolean;
  visits: number;
};

const KEY = 'mc_blindaje_v1';

export function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p && typeof p === 'object' && p.answers) return { visits: 0, ...p };
    }
  } catch { /* storage blocked → fresh profile */ }
  return { answers: {}, visits: 0 };
}

export function saveProfile(p: Profile) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* ignore */ }
}

export function saveAnswer(key: string, value: string): Profile {
  const p = loadProfile();
  p.answers = { ...p.answers, [key]: value };
  saveProfile(p);
  return p;
}

/** Called once per page load so we know when someone is a return visitor. */
export function bumpVisit() {
  try {
    if (sessionStorage.getItem('mc_visit_counted')) return;
    sessionStorage.setItem('mc_visit_counted', '1');
  } catch { /* ignore */ }
  const p = loadProfile();
  p.visits = (p.visits || 0) + 1;
  saveProfile(p);
}

export const visit1Done = (p: Profile) => VISIT1.every((q) => p.answers[q.key]);
export const nextUnanswered = (p: Profile, pool = ALL_QUESTIONS) => pool.find((q) => !p.answers[q.key]);

export function labelFor(key: string, value: string) {
  const q = ALL_QUESTIONS.find((x) => x.key === key);
  return q?.options.find((o) => o.value === value)?.label ?? value;
}

/** Decide what this visitor sees in the diagnostic. */
export function planQuestions(p: Profile): { mode: 'first' | 'return'; questions: Question[] } {
  if (!visit1Done(p) || !p.submitted_at) {
    return { mode: 'first', questions: VISIT1.filter((q) => !p.answers[q.key]) };
  }
  return { mode: 'return', questions: LATER.filter((q) => !p.answers[q.key]).slice(0, LATER_PER_VISIT) };
}

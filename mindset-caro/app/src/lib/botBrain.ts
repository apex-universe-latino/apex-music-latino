// "Caro IA" — scripted FAQ brain in Carolina's voice. No LLM, no paid API.
//
// To plug an LLM later:   setBotAdapter(async (text, ctx) => {
//                           const r = await fetch('/api/caro-ia', { method:'POST', body: JSON.stringify({ text, ctx }) });
//                           return r.ok ? { text: (await r.json()).reply } : null;   // null → scripted fallback
//                         });
// (also exposed as window.CaroIA.setAdapter). Every reply — scripted or LLM — passes
// through complianceGuard() so the bot can never promise returns.
import type { Profile } from './profile';

export type Chip = { label: string; action: string };
export type BotReply = { text: string; chips?: Chip[] };
export type BotContext = { profile: Profile; history: { from: 'bot' | 'user'; text: string }[] };
export type BotAdapter = (text: string, ctx: BotContext) => Promise<BotReply | null>;

let adapter: BotAdapter | null = null;
export function setBotAdapter(fn: BotAdapter | null) { adapter = fn; }
if (typeof window !== 'undefined') {
  (window as unknown as { CaroIA?: { setAdapter: typeof setBotAdapter } }).CaroIA = { setAdapter: setBotAdapter };
}

export const GREETING =
  'Hola, soy Caro IA, la asistente virtual de Mindset Caro. Te explico cómo funciona el Blindaje Patrimonial ' +
  'o te ayudo a saber qué tan blindado estás. ¿Por dónde empezamos?';

export const FAQ_CHIPS: Chip[] = [
  { label: '¿Qué es blindaje patrimonial?', action: 'faq:que_es' },
  { label: '¿Dónde se invierte?', action: 'faq:donde' },
  { label: '¿Qué pasa si me pasa algo?', action: 'faq:si_pasa' },
  { label: '¿Cuánto cuesta?', action: 'faq:costo' },
  { label: '¿En cuánto tiempo?', action: 'faq:tiempo' },
  { label: '¿Es seguro?', action: 'faq:seguro' },
];

export const FAQ: Record<string, { q: string; a: string; kw: RegExp }> = {
  que_es: {
    q: '¿Qué es blindaje patrimonial?',
    kw: /(qu[eé] es|blindaje|patrimonial|c[oó]mo funciona|de qu[eé] se trata)/i,
    a: 'Así le llamo a un plan con dos motores. Una parte de tu aporte paga un seguro de vida que protege a tu familia desde el día uno. ' +
      'La otra parte es ahorro que se invierte a largo plazo. Tu capital queda protegido desde el principio y, al mismo tiempo, ' +
      'construyes lo que tú quieras: tu jubilación, la educación de tus hijos o un capital para invertir.',
  },
  donde: {
    q: '¿Dónde se invierte?',
    kw: /(d[oó]nde|invierte|inversi[oó]n|s&p|sp ?500|etf|fondo|d[oó]lar|acciones)/i,
    a: 'La parte de ahorro se invierte en un ETF que replica el S&P 500, el índice de las 500 empresas más grandes de Estados Unidos. ' +
      'Es uno de los índices más diversificados del mundo y lo pensamos como una inversión de largo plazo. Eso sí: como toda inversión, ' +
      'puede subir y bajar, y las rentabilidades pasadas no garantizan rentabilidades futuras.',
  },
  si_pasa: {
    q: '¿Qué pasa si me pasa algo?',
    kw: /(me pasa algo|si me muero|fallec|muero|accidente|invalidez|mi familia|qu[eé] pasa si)/i,
    a: 'Esa es justamente la diferencia con una inversión normal. Una casa puede tardar meses en venderse, un CDT está atado a su plazo ' +
      'y las acciones pueden estar abajo justo ese día. Con el componente de protección, tu familia tiene liquidez cuando más la necesita, ' +
      'según las condiciones de la póliza.',
  },
  costo: {
    q: '¿Cuánto cuesta?',
    kw: /(cu[aá]nto cuesta|precio|valor|costo|cuota|cu[aá]nto (vale|pago|tengo que pagar)|mensualidad)/i,
    a: 'Depende de tu edad, de cuánto quieras ahorrar al mes y de la protección que necesites, así que prefiero no darte un número al aire. ' +
      'El plan está diseñado para que en un horizonte de 10 años recuperes el costo de la protección (según condiciones del plan). ' +
      'En el diagnóstico de 3 minutos te muestro un estimado ilustrativo con tus propios rangos.',
  },
  tiempo: {
    q: '¿En cuánto tiempo?',
    kw: /(cu[aá]nto tiempo|cu[aá]ntos a[nñ]os|plazo|cu[aá]ndo|horizonte|a[nñ]os)/i,
    a: 'Trabajo con un horizonte de 10 años: es el tiempo en el que el plan está diseñado para que recuperes el costo de la protección ' +
      'mientras tu ahorro crece. La protección, eso sí, arranca desde el día uno, sujeta a la aprobación de la aseguradora.',
  },
  seguro: {
    q: '¿Es seguro?',
    kw: /(es seguro|riesgo|confiable|conf[ií]o|estafa|garant|perder|pierdo)/i,
    a: 'Te respondo con honestidad. La protección depende de las condiciones de la póliza y de la aprobación de la aseguradora. ' +
      'La parte de ahorro está invertida en el mercado, así que tiene riesgo: en el corto plazo puede bajar. Por eso la pensamos a largo plazo ' +
      'y en un índice muy diversificado. Nadie serio te puede garantizar rentabilidades, y yo tampoco lo hago.',
  },
};

export const FALLBACK =
  'Buena pregunta. Esa prefiero respondértela personalmente para no darte algo genérico. ' +
  'Puedes hacer el diagnóstico gratis o dejarme tu WhatsApp para que Caro te escriba.';

const RECRUIT_RE = /(trabaj|empleo|vacante|asesor[a]? (con|de) caro|unirme|equipo|reclut)/i;
const TALK_RE = /(hablar|whats|llamada|llamar|contact|asesor[ií]a|agendar|cita)/i;
const DIAG_RE = /(diagn[oó]stico|test|puntaje|qu[eé] tan blindad)/i;

export type Intent = { kind: 'faq'; key: string } | { kind: 'recruit' } | { kind: 'talk' } | { kind: 'diag' } | { kind: 'unknown' };

export function classify(text: string): Intent {
  if (RECRUIT_RE.test(text)) return { kind: 'recruit' };
  if (DIAG_RE.test(text)) return { kind: 'diag' };
  // order matters: specific FAQs before the broad "qué es"
  for (const key of ['si_pasa', 'costo', 'seguro', 'donde', 'tiempo', 'que_es']) {
    if (FAQ[key].kw.test(text)) return { kind: 'faq', key };
  }
  if (TALK_RE.test(text)) return { kind: 'talk' };
  return { kind: 'unknown' };
}

/** Free-text replies: LLM adapter first (if plugged in), scripted otherwise. */
export async function replyTo(text: string, ctx: BotContext): Promise<{ reply: BotReply | null; intent: Intent }> {
  const intent = classify(text);
  if (adapter) {
    try {
      const r = await adapter(text, ctx);
      if (r?.text) return { reply: { ...r, text: complianceGuard(r.text) }, intent };
    } catch { /* fall through to scripted */ }
  }
  if (intent.kind === 'faq') return { reply: { text: FAQ[intent.key].a }, intent };
  return { reply: null, intent };
}

// Words the SFC / Meta financial-ads rules don't allow us to say.
const FORBIDDEN = /(garantizad[oa]s?|rentabilidad (asegurada|garantizada)|sin riesgo|s[uú]per seguro|cero riesgo|100 ?% seguro|no puedes perder)/i;
export function complianceGuard(text: string): string {
  if (!FORBIDDEN.test(text)) return text;
  return 'Prefiero ser precisa: ninguna inversión tiene rentabilidad garantizada. ' + FALLBACK;
}

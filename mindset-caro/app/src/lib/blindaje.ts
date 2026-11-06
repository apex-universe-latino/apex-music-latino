// Illustrative maths for the diagnostic result. These are NOT quotes and NOT promises:
// every number is derived from answer RANGES with simple, stated assumptions, and the UI
// shows the assumptions + the compliance disclaimer next to them.
import type { Profile, Result } from './profile';

/** Midpoint of the monthly savings range (COP). */
const SAVINGS_MID: Record<string, number> = {
  'Menos de 500 mil': 400_000,
  '500 mil – 1 millón': 750_000,
  '1 – 3 millones': 2_000_000,
  'Más de 3 millones': 3_500_000,
};

/** Monthly household income proxy when we don't know it yet, keyed by savings range. */
const INCOME_FROM_SAVINGS: Record<string, number> = {
  'Menos de 500 mil': 4_000_000,
  '500 mil – 1 millón': 6_500_000,
  '1 – 3 millones': 12_000_000,
  'Más de 3 millones': 20_000_000,
};

const INCOME_MID: Record<string, number> = {
  'Menos de 3 millones': 2_500_000,
  '3 – 6 millones': 4_500_000,
  '6 – 12 millones': 9_000_000,
  '12 – 25 millones': 18_000_000,
  'Más de 25 millones': 30_000_000,
};

const DEPENDENTS: Record<string, number> = { '0': 0, '1': 1, '2': 2, '3+': 3 };

/** Hypothetical annual returns used ONLY to illustrate (net, in COP). Not a forecast. */
export const RATE_CONSERVATIVE = 0.04;
export const RATE_MODERATE = 0.07;
export const YEARS = 10;

export function futureValueMonthly(monthly: number, annualRate: number, years: number) {
  const r = annualRate / 12;
  const n = years * 12;
  return r === 0 ? monthly * n : monthly * ((Math.pow(1 + r, n) - 1) / r);
}

export type ResultDetail = Result & {
  monthly: number;
  contributed: number;
  projection_low: number;
  need_cop: number;
  covered_cop: number;
  years_support: number;
  income_monthly: number;
  income_is_estimate: boolean;
};

export function computeResult(p: Profile): ResultDetail {
  const a = p.answers;
  const monthly = SAVINGS_MID[a.rango_ahorro_mensual] ?? 750_000;
  const deps = DEPENDENTS[a.dependientes] ?? 1;
  const income_is_estimate = !INCOME_MID[a.ingreso_mensual];
  const income_monthly = INCOME_MID[a.ingreso_mensual] ?? INCOME_FROM_SAVINGS[a.rango_ahorro_mensual] ?? 6_500_000;

  // Protection need: years of household income the family would need to keep going.
  // 1 year with no dependents (debts, final expenses), +2 years per dependent, capped at 7.
  const years_support = Math.min(7, deps === 0 ? 1 : 1 + 2 * deps);
  const need_cop = income_monthly * 12 * years_support;
  // Existing cover: unknown amounts, so we assume a typical policy covers ~40 % of the need.
  const hasCover = a.tiene_seguro_vida === 'Sí, con ahorro' || a.tiene_seguro_vida === 'Sí, solo protección';
  const covered_cop = hasCover ? Math.round(need_cop * 0.4) : 0;
  const gap_cop = roundM(Math.max(0, need_cop - covered_cop));

  const contributed = monthly * 12 * YEARS;
  const projection_low = roundM(futureValueMonthly(monthly, RATE_CONSERVATIVE, YEARS));
  const projection_cop = roundM(futureValueMonthly(monthly, RATE_MODERATE, YEARS));

  // Score "¿Qué tan blindado estás?" 0–100.
  let s = 0;
  s += { 'Sí, con ahorro': 38, 'Sí, solo protección': 22, 'No sé': 6, No: 0 }[a.tiene_seguro_vida as string] ?? 0;
  s += { 'Acciones / fondos': 16, 'CDT / cuenta de ahorros': 12, 'Finca raíz': 9, Cripto: 7, 'Aún no ahorro': 0 }[a.donde_ahorra as string] ?? 0;
  s += { 'Menos de 500 mil': 6, '500 mil – 1 millón': 12, '1 – 3 millones': 17, 'Más de 3 millones': 20 }[a.rango_ahorro_mensual as string] ?? 0;
  // More people depending on you = more exposure if protection is missing.
  s += hasCover ? 16 : [16, 8, 4, 0][deps] ?? 0;
  s += a.meta_blindaje ? 6 : 0;
  const score = Math.max(8, Math.min(92, Math.round(s)));

  return { score, gap_cop, projection_cop, monthly, contributed, projection_low, need_cop, covered_cop, years_support, income_monthly, income_is_estimate };
}

const roundM = (n: number) => Math.round(n / 100_000) * 100_000;

export function scoreLabel(score: number) {
  if (score >= 70) return { title: 'Bien encaminado', body: 'Tienes bases sólidas. Ahora se trata de que protección y ahorro trabajen juntos.' };
  if (score >= 40) return { title: 'Blindaje parcial', body: 'Tienes piezas, pero hay huecos: si mañana pasa algo, tu familia podría quedar sin liquidez.' };
  return { title: 'Patrimonio expuesto', body: 'Hoy tu familia depende de que nada salga mal. Lo bueno: se arregla con un plan.' };
}

export function formatCOP(n: number) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toLocaleString('es-CO', { maximumFractionDigits: 1 })} mil M`;
  if (n >= 1_000_000) return `$${Math.round(n / 1_000_000).toLocaleString('es-CO')} M`;
  return `$${Math.round(n).toLocaleString('es-CO')}`;
}

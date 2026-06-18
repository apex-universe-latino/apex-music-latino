// IndependenceCalculator.tsx — "Calculadora de Protección / Independencia" (Mindset Caro)
// Standalone Tailwind drop-in.
//
//   <IndependenceCalculator apiBase="" />   // same-origin → /api/lead + /api/ingest
//
// Reads formula constants from the CMS (GET /api/mc-content?site=diagnostico → calc.constants),
// falling back to the defaults from the original design. Crimson/black aesthetic.

import React, { useEffect, useMemo, useState } from 'react';

type Constants = {
  coverageMultiplier: number; // months of income as coverage
  dependentFactor: number;    // per dependent
  baseRate: number;           // premium base rate
  ageBaseline: number;
  ageFactor: number;          // per year over baseline
};

const DEFAULTS: Constants = {
  coverageMultiplier: 120, dependentFactor: 0.15, baseRate: 0.005, ageBaseline: 30, ageFactor: 0.03,
};

type Props = { apiBase?: string; onSend?: (r: { coverageCOP: number; monthlyCOP: number }) => void };

const fmtCOP = (n: number) =>
  '$' + Math.round(n).toLocaleString('es-CO');

function visitorId(): string | null {
  try { return localStorage.getItem('apex_visitor_id'); } catch { return null; }
}
function readUTM() {
  const utm: Record<string, string> = {};
  try {
    const q = new URLSearchParams(window.location.search);
    ['source', 'medium', 'campaign'].forEach((k) => { const v = q.get('utm_' + k); if (v) utm[k] = v; });
  } catch { /* noop */ }
  return utm;
}

export default function IndependenceCalculator({ apiBase = '', onSend }: Props) {
  const [c, setC] = useState<Constants>(DEFAULTS);
  const [ingreso, setIngreso] = useState(8_000_000); // COP / month
  const [age, setAge] = useState(38);
  const [dep, setDep] = useState(1);
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch(`${apiBase}/api/mc-content?site=diagnostico`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { const k = d?.content?.['calc.constants']; if (k && typeof k === 'object') setC({ ...DEFAULTS, ...k }); })
      .catch(() => {});
  }, [apiBase]);

  const { coverageCOP, monthlyCOP } = useMemo(() => {
    const coverage = ingreso * c.coverageMultiplier * (1 + dep * c.dependentFactor);
    const monthly = (coverage * c.baseRate * (1 + (age - c.ageBaseline) * c.ageFactor)) / 12;
    return { coverageCOP: Math.max(0, coverage), monthlyCOP: Math.max(0, monthly) };
  }, [ingreso, age, dep, c]);

  async function send() {
    if (!email || !email.includes('@')) { setErr('Ingresa un email válido para recibir tu plan.'); return; }
    setErr(''); setBusy(true);
    try {
      await fetch(`${apiBase}/api/lead`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'calculator', email, ingreso, age, dependientes: dep,
          coverageCOP: Math.round(coverageCOP), monthlyCOP: Math.round(monthlyCOP),
          visitor_id: visitorId(), utm: readUTM(),
        }),
      });
    } catch { /* demo-safe */ }
    setBusy(false); setDone(true);
    onSend?.({ coverageCOP, monthlyCOP });
  }

  return (
    <div className="w-full max-w-3xl mx-auto rounded-3xl border border-neutral-800 bg-neutral-950 p-8 text-white shadow-[0_18px_50px_-20px_rgba(230,0,0,0.45)]">
      <div className="text-center">
        <div className="font-mono text-[11px] tracking-[3px] text-red-400">CALCULADORA DE PROTECCIÓN</div>
        <h3 className="mt-2 text-3xl font-extrabold tracking-tight">¿Cuánto necesitas para blindar tu futuro?</h3>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* controls */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm"><span className="text-neutral-400">Ingreso mensual</span><span className="font-bold text-red-500">{fmtCOP(ingreso)}</span></div>
            <input type="range" min={1_000_000} max={50_000_000} step={500_000} value={ingreso} onChange={(e) => setIngreso(+e.target.value)} className="mt-2 w-full accent-red-600" />
          </div>
          <div>
            <div className="flex justify-between text-sm"><span className="text-neutral-400">Tu edad</span><span className="font-bold text-red-500">{age} años</span></div>
            <input type="range" min={18} max={70} value={age} onChange={(e) => setAge(+e.target.value)} className="mt-2 w-full accent-red-600" />
          </div>
          <div>
            <div className="text-sm text-neutral-400">Personas que dependen de ti</div>
            <div className="mt-2 flex gap-2">
              {[0, 1, 2, 3, 4].map((n) => (
                <button key={n} onClick={() => setDep(n)} className={`h-11 w-11 rounded-xl border text-sm font-bold ${dep === n ? 'border-red-600 bg-red-600 text-white' : 'border-neutral-700 bg-neutral-900 text-neutral-300'}`}>{n}</button>
              ))}
            </div>
          </div>
        </div>

        {/* result */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
          <div className="font-mono text-[11px] tracking-wide text-neutral-400">COBERTURA SUGERIDA</div>
          <div className="mt-1 text-4xl font-extrabold text-red-500">{fmtCOP(coverageCOP)}</div>
          <div className="mt-4 font-mono text-[11px] tracking-wide text-neutral-400">ESTIMADO MENSUAL</div>
          <div className="text-2xl font-bold">{fmtCOP(monthlyCOP)} <span className="text-sm font-normal text-neutral-400">/ mes</span></div>
          <p className="mt-3 font-mono text-[10px] leading-relaxed text-neutral-500">⚠ estimación referencial — el plan real se ajusta en tu asesoría</p>

          {!done ? (
            <>
              <input className="mt-4 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-[15px] outline-none focus:border-red-600" placeholder="Email para recibir tu plan detallado" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              {err && <div className="mt-2 font-mono text-xs text-red-400">{err}</div>}
              <button onClick={send} disabled={busy} className="mt-3 w-full rounded-xl bg-red-600 py-4 font-bold text-white shadow-[0_10px_30px_-8px_rgba(230,0,0,0.7)] disabled:opacity-70">
                {busy ? 'Enviando…' : 'Recibir mi plan detallado'}
              </button>
            </>
          ) : (
            <div className="mt-4 rounded-xl border border-red-900/40 bg-red-950/20 p-4 text-center text-sm">
              <span className="text-red-400 font-bold">¡Listo!</span> Tu plan va en camino a <span className="font-semibold">{email}</span>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

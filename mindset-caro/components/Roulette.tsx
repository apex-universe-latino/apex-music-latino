// Roulette.tsx — "Gira y Gana" prize wheel (Mindset Caro)
// Standalone Tailwind drop-in. Wire into the React app layout.
//
//   <Roulette apiBase="" />            // same-origin (mindsetcaro.com) — uses /api/lead + /api/ingest
//   <Roulette prizes={[...]} onClaim={(p)=>...} />
//
// Reads prizes from the CMS (GET /api/mc-content?site=diagnostico → game.prizes) when not passed.
// Crimson/black aesthetic via Tailwind. No external deps beyond React.

import React, { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  apiBase?: string;                 // default '' (same origin)
  prizes?: string[];                // override CMS prizes
  onClaim?: (prize: string) => void;
};

const DEFAULT_PRIZES = [
  'Guía: Blinda tu Futuro',
  '20% en tu 1ª póliza',
  'Sesión 1:1 gratis',
  'Playbook de Ventas',
  'Audio Mindset',
  'Masterclass gratis',
];

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

export default function Roulette({ apiBase = '', prizes: prizesProp, onClaim }: Props) {
  const [prizes, setPrizes] = useState<string[]>(prizesProp || DEFAULT_PRIZES);
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [won, setWon] = useState<string | null>(null);
  const [step, setStep] = useState<'wheel' | 'capture' | 'done'>('wheel');
  const [form, setForm] = useState({ nombre: '', email: '', whatsapp: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const wonIdx = useRef<number>(0);

  // Pull prizes from the CMS if not provided.
  useEffect(() => {
    if (prizesProp) return;
    fetch(`${apiBase}/api/mc-content?site=diagnostico`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const p = d?.content?.['game.prizes'];
        if (Array.isArray(p) && p.length) setPrizes(p);
      })
      .catch(() => {});
  }, [apiBase, prizesProp]);

  const seg = 360 / prizes.length;
  const gradient = useMemo(() => {
    const stops = prizes
      .map((_, i) => `${i % 2 ? '#e60000' : '#b00000'} ${i * seg}deg ${(i + 1) * seg}deg`)
      .join(', ');
    return `conic-gradient(${stops})`;
  }, [prizes, seg]);

  function track(event: string, payload: Record<string, unknown>) {
    fetch(`${apiBase}/api/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_app: 'mindset-caro-site', event, visitor_id: visitorId(), payload, utm: readUTM() }),
      keepalive: true,
    }).catch(() => {});
  }

  function spin() {
    if (spinning) return;
    setSpinning(true);
    const idx = Math.floor(Math.random() * prizes.length);
    wonIdx.current = idx;
    // land the chosen segment under the top pointer (pointer at 0deg / top)
    const target = 360 * 5 + (360 - (idx * seg + seg / 2));
    setAngle((a) => a + target);
    track('roulette.spin', { index: idx, prize: prizes[idx] });
    window.setTimeout(() => {
      setSpinning(false);
      setWon(prizes[idx]);
      setStep('capture');
    }, 4300);
  }

  async function claim() {
    if (!form.email || !form.email.includes('@')) { setErr('Ingresa un email válido.'); return; }
    setErr(''); setBusy(true);
    const payload = {
      source: 'roulette',
      prize: won,
      nombre: form.nombre, email: form.email, whatsapp: form.whatsapp,
      visitor_id: visitorId(), utm: readUTM(),
      referrer: typeof document !== 'undefined' ? document.referrer : null,
    };
    try {
      await fetch(`${apiBase}/api/lead`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } catch { /* demo-safe */ }
    setBusy(false);
    setStep('done');
    onClaim?.(won || '');
  }

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl border border-neutral-800 bg-neutral-950 p-8 text-white shadow-[0_18px_50px_-20px_rgba(230,0,0,0.45)]">
      <div className="text-center">
        <div className="font-mono text-[11px] tracking-[3px] text-red-400">GIRA Y GANA</div>
        <h3 className="mt-2 text-2xl font-extrabold tracking-tight">Tu regalo, al azar</h3>
      </div>

      {step === 'wheel' && (
        <div className="mt-7 flex flex-col items-center">
          <div className="relative h-64 w-64">
            {/* pointer */}
            <div className="absolute left-1/2 top-[-6px] z-10 -translate-x-1/2 border-x-[10px] border-t-[16px] border-x-transparent border-t-red-600" />
            <div
              className="h-64 w-64 rounded-full border-4 border-white/90 transition-transform duration-[4300ms] ease-[cubic-bezier(0.17,0.67,0.18,0.99)]"
              style={{ background: gradient, transform: `rotate(${angle}deg)` }}
            />
            {/* hub */}
            <button
              onClick={spin}
              disabled={spinning}
              className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white text-sm font-extrabold text-red-600 shadow-lg disabled:opacity-70"
            >
              {spinning ? '...' : 'GIRAR'}
            </button>
          </div>
          <ul className="mt-6 grid w-full grid-cols-2 gap-x-4 gap-y-1 text-xs text-neutral-400">
            {prizes.map((p, i) => (
              <li key={i} className="flex gap-2"><span className="text-red-500">{i + 1}.</span>{p}</li>
            ))}
          </ul>
        </div>
      )}

      {step === 'capture' && (
        <div className="mt-7">
          <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-4 text-center">
            <div className="font-mono text-[11px] tracking-wide text-red-400">¡TE GANASTE!</div>
            <div className="mt-1 text-xl font-bold">{won}</div>
          </div>
          <p className="mt-4 text-sm text-neutral-400">¿A dónde te enviamos tu regalo?</p>
          <div className="mt-3 flex flex-col gap-3">
            <input className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-[15px] outline-none focus:border-red-600" placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            <input className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-[15px] outline-none focus:border-red-600" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-[15px] outline-none focus:border-red-600" placeholder="WhatsApp" type="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
          </div>
          {err && <div className="mt-2 font-mono text-xs text-red-400">{err}</div>}
          <button onClick={claim} disabled={busy} className="mt-4 w-full rounded-xl bg-red-600 py-4 font-bold text-white shadow-[0_10px_30px_-8px_rgba(230,0,0,0.7)] disabled:opacity-70">
            {busy ? 'Enviando…' : 'Reclamar mi regalo'}
          </button>
        </div>
      )}

      {step === 'done' && (
        <div className="mt-7 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-3xl shadow-[0_10px_30px_-8px_rgba(230,0,0,0.7)]">✓</div>
          <div className="mt-4 text-xl font-bold">¡Listo! Revisa tu correo</div>
          <p className="mt-2 text-sm text-neutral-400">Tu regalo (<span className="text-red-400">{won}</span>) va en camino. Carolina te contactará por WhatsApp.</p>
        </div>
      )}
    </div>
  );
}

import { useInView, useCountUp } from '../hooks/motion';

// Illustrative 10-year chart: the net cost of protection rises, then is recovered by year 10
// (per plan conditions) while the savings curve compounds. No real figures on purpose.
const X0 = 48, X1 = 572, Y0 = 268, Y1 = 34;
const x = (t: number) => X0 + (t / 10) * (X1 - X0);
const y = (v: number) => Y0 - v * (Y0 - Y1);

const r = 0.07 / 12;
const fv = (t: number) => (Math.pow(1 + r, t * 12) - 1) / r;
const FV10 = fv(10);
const savings = (t: number) => (fv(t) / FV10) * 0.92;
const contributed = (t: number) => ((t * 12) / FV10) * 0.92;
// net cost of protection: accumulates early, recovered to 0 at year 10 (illustrative shape)
const cost = (t: number) => 0.26 * Math.sin((Math.PI * t) / 10) * (1 - t / 22);

const pathOf = (f: (t: number) => number) =>
  Array.from({ length: 41 }, (_, i) => i / 4).map((t, i) => `${i ? 'L' : 'M'}${x(t).toFixed(1)} ${y(f(t)).toFixed(1)}`).join(' ');

export default function Timeline() {
  const [ref, seen] = useInView<HTMLDivElement>(0.35);
  const year = useCountUp(10, seen, 1900);
  return (
    <div ref={ref} className={`mt-20 ${seen ? 'is-in' : ''}`}>
      <div className="reveal mx-auto max-w-3xl text-center">
        <p className="eyebrow">El horizonte: 10 años</p>
        <h3 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">La protección se recupera. El ahorro se queda contigo.</h3>
        <p className="mt-4 text-lg leading-relaxed text-graphite/70">
          El plan está diseñado para que en un horizonte de 10 años recuperes el costo de la protección <i>(según condiciones del plan)</i>.
          Lo que te queda es el capital que ahorraste más lo que haya rentado en ese tiempo.
        </p>
      </div>

      <div className="reveal mx-auto mt-8 max-w-4xl rounded-3xl border border-graphite/10 bg-dark-light p-3 sm:p-6" style={{ ['--i' as string]: 1 }}>
        <div className="flex items-baseline justify-between px-2">
          <span className="font-mono text-xs uppercase tracking-widest text-graphite/50">Ilustrativo</span>
          <span className="num font-mono text-sm text-graphite/80">Año <b className="text-2xl text-graphite">{Math.round(year)}</b></span>
        </div>
        <svg viewBox="0 0 600 310" className="mt-2 w-full" role="img"
          aria-label="Gráfica ilustrativa a 10 años: el costo neto de la protección sube y vuelve a cero en el año 10, mientras el ahorro crece.">
          <defs>
            <linearGradient id="tl-sav" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#292c2b" stopOpacity=".22" />
              <stop offset="1" stopColor="#292c2b" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 2, 4, 6, 8, 10].map((t) => (
            <g key={t}>
              <line x1={x(t)} x2={x(t)} y1={Y1} y2={Y0} stroke="#ffffff" strokeOpacity=".06" />
              <text x={x(t)} y={Y0 + 22} textAnchor="middle" fill="#ffffff" fillOpacity=".5" fontSize="15" fontFamily="'Space Mono', monospace">
                {t === 0 ? 'Hoy' : `Año ${t}`}
              </text>
            </g>
          ))}
          <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="#ffffff" strokeOpacity=".25" />

          <path d={`${pathOf(savings)} L${x(10)} ${Y0} L${x(0)} ${Y0} Z`} fill="url(#tl-sav)" className="reveal" style={{ ['--i' as string]: 8 }} />
          <path d={pathOf(contributed)} className="reveal" fill="none" stroke="#292c2b" strokeOpacity=".45" strokeWidth="2" strokeDasharray="5 6" style={{ ['--i' as string]: 6 }} />
          <path d={pathOf(savings)} pathLength={1} className="draw" fill="none" stroke="#292c2b" strokeWidth="4" strokeLinecap="round" style={{ ['--d' as string]: '.2s' }} />
          <path d={pathOf(cost)} pathLength={1} className="draw" fill="none" stroke="#173b38" strokeWidth="4" strokeLinecap="round" style={{ ['--d' as string]: '.35s' }} />

          <g className="reveal" style={{ ['--i' as string]: 20 }}>
            <circle cx={x(10)} cy={y(savings(10))} r="7" fill="#292c2b" />
            <text x={x(10) - 12} y={y(savings(10)) - 14} textAnchor="end" fill="#292c2b" fontSize="19" fontWeight="800" fontFamily="Inter, sans-serif">Tu capital + rendimientos*</text>
            <circle cx={x(10)} cy={y(0)} r="7" fill="#173b38" />
            <text x={x(10) - 12} y={y(0) - 12} textAnchor="end" fill="#ff4d4d" fontSize="18" fontWeight="800" fontFamily="Inter, sans-serif">Costo de la protección: recuperado*</text>
          </g>
        </svg>
        <div className="flex flex-wrap gap-x-5 gap-y-2 px-2 pb-1 pt-2 text-xs text-graphite/70">
          <span className="flex items-center gap-2"><i className="inline-block h-1 w-5 rounded bg-bone" />Ahorro invertido</span>
          <span className="flex items-center gap-2"><i className="inline-block h-0.5 w-5 rounded bg-bone/50" />Lo que aportaste</span>
          <span className="flex items-center gap-2"><i className="inline-block h-1 w-5 rounded bg-crimson" />Costo neto de la protección</span>
        </div>
      </div>
      <p className="mx-auto mt-4 max-w-3xl text-center text-xs leading-relaxed text-graphite/45">
        *Gráfica ilustrativa: no representa la rentabilidad ni las condiciones de un plan específico. Las rentabilidades pasadas no garantizan rentabilidades futuras.
        El resultado real depende del comportamiento del mercado y de las condiciones de la póliza.
      </p>
    </div>
  );
}

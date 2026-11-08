import { Home, Landmark, BarChart3, ShieldCheck } from 'lucide-react';
import Reveal from '../components/Reveal';

// "¿Qué pasa si mañana…?" — how fast each asset turns into cash for the family.
// Meters are qualitative (illustrative), not measured data.
const ROWS = [
  { icon: Home, t: 'Casa / finca raíz', d: 'Hay que venderla: puede tomar meses, y con afán se vende por menos.', v: 0.14, tag: 'Meses' },
  { icon: Landmark, t: 'CDT', d: 'Atado a su plazo: sacarlo antes no siempre se puede o tiene penalidad.', v: 0.34, tag: 'Al vencimiento' },
  { icon: BarChart3, t: 'Acciones', d: 'Se pueden vender, pero quizá estén abajo justo cuando tu familia necesita el dinero.', v: 0.55, tag: 'Depende del mercado' },
];

export default function Compare() {
  return (
    <section id="liquidez" className="section bg-dark-light">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">Liquidez para tu familia</p>
          <h2 className="h2 mt-3 max-w-3xl">Diferencia vs una inversión normal: liquidez para tu familia cuando más la necesita.</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-graphite/70">
            Si mañana te pasa algo, ¿qué tan rápido le llega el dinero a tu familia? Esa es la pregunta que casi nadie se hace.
          </p>
        </Reveal>

        <Reveal self={false} className="mt-10 grid gap-3">
          {ROWS.map((r, i) => (
            <div key={r.t} className="reveal rounded-2xl border border-graphite/10 bg-dark p-5" style={{ ['--i' as string]: i }}>
              <div className="flex items-start gap-4">
                <r.icon className="mt-1 h-6 w-6 shrink-0 text-graphite/60" aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-extrabold">{r.t}</h3>
                    <span className="font-mono text-[11px] uppercase tracking-widest text-graphite/50">{r.tag}</span>
                  </div>
                  <p className="mt-1 text-graphite/65">{r.d}</p>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-graphite/10" aria-hidden>
                    <div className="meter-fill h-full rounded-full bg-graphite/40" style={{ ['--v' as string]: r.v, ['--i' as string]: i }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="reveal glow-node rounded-2xl bg-gradient-to-r from-crimson-deep to-dark p-5" style={{ ['--i' as string]: 3 }}>
            <div className="flex items-start gap-4">
              <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-graphite" aria-hidden />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-extrabold">Blindaje Patrimonial</h3>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-graphite/80">Cuando más se necesita</span>
                </div>
                <p className="mt-1 text-graphite/85">El componente de protección le da liquidez a tu familia cuando más la necesita, sin tener que vender nada a las carreras.*</p>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-graphite/15" aria-hidden>
                  <div className="meter-fill h-full rounded-full bg-crimson-glow" style={{ ['--v' as string]: 1, ['--i' as string]: 4 }} />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
        <p className="mt-4 text-xs text-graphite/45">*Según las condiciones de la póliza y sujeto a aprobación de la aseguradora. Comparación cualitativa e ilustrativa.</p>
      </div>
    </section>
  );
}

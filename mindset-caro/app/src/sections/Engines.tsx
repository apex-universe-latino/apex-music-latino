import { ShieldCheck, TrendingUp, Check } from 'lucide-react';
import Reveal from '../components/Reveal';
import Timeline from './Timeline';
import { useInView, prefersReducedMotion } from '../hooks/motion';

// "Data flowing into one record" (HyperFrames system scene), re-skinned: the two engines feed
// one plan, and the record fills in field by field.
const ROWS = [
  ['Protección', 'Activa desde el día 1'],
  ['Ahorro', 'ETF del S&P 500 · largo plazo'],
  ['Horizonte', '10 años'],
  ['Meta', 'La que tú elijas'],
];

function Flow() {
  const [ref, seen] = useInView<HTMLDivElement>(0.3);
  const motion = seen && !prefersReducedMotion();
  const paths = ['M100 0 C100 46 200 30 200 78', 'M300 0 C300 46 200 30 200 78'];
  return (
    <div ref={ref} id="motores" className={`mx-auto mt-12 max-w-3xl ${seen ? 'is-in' : ''}`}>
      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        <div className="reveal glow-node rounded-2xl bg-gradient-to-b from-crimson/25 to-dark p-4 sm:p-6" style={{ ['--i' as string]: 0 }}>
          <ShieldCheck className="h-7 w-7 text-crimson-glow" aria-hidden />
          <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-white/60">Motor 1</p>
          <h3 className="mt-1 text-lg font-extrabold leading-tight sm:text-2xl">Protección desde el día 1</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/65 sm:text-base">Un seguro de vida que responde por tu familia si algo te pasa.</p>
        </div>
        <div className="reveal rounded-2xl border border-white/15 bg-dark-lighter p-4 sm:p-6" style={{ ['--i' as string]: 1 }}>
          <TrendingUp className="h-7 w-7 text-bone" aria-hidden />
          <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-white/60">Motor 2</p>
          <h3 className="mt-1 text-lg font-extrabold leading-tight sm:text-2xl">Ahorro invertido en el S&amp;P 500</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/65 sm:text-base">Las 500 empresas más grandes de EE. UU., a través de un ETF.</p>
        </div>
      </div>

      <svg viewBox="0 0 400 80" className="block w-full" aria-hidden>
        {paths.map((d, i) => (
          <g key={d}>
            <path d={d} fill="none" stroke="#3a2a2a" strokeWidth="3" />
            <path d={d} pathLength={1} className="draw" fill="none" stroke={i === 0 ? '#e60000' : '#f3f1ec'} strokeWidth="3"
              strokeLinecap="round" style={{ ['--d' as string]: `${0.3 + i * 0.15}s` }} />
            {motion && (
              <circle r="4.5" fill={i === 0 ? '#ff1a1a' : '#f3f1ec'}>
                <animateMotion dur="2.2s" begin={`${1.6 + i * 0.4}s`} repeatCount="indefinite" path={d} />
              </circle>
            )}
          </g>
        ))}
      </svg>

      <div className="reveal rounded-2xl border border-crimson/50 bg-dark p-5 shadow-[0_0_60px_-20px_rgba(230,0,0,.6)] sm:p-7" style={{ ['--i' as string]: 3 }}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black tracking-tight sm:text-2xl">Tu Blindaje Patrimonial</h3>
          <span className="rounded-full bg-crimson px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest">Un solo plan</span>
        </div>
        <dl className="mt-4 divide-y divide-white/10">
          {ROWS.map(([k, v], i) => (
            <div key={k} className="reveal flex items-center justify-between gap-4 py-3" style={{ ['--i' as string]: 6 + i * 2 }}>
              <dt className="font-mono text-xs uppercase tracking-widest text-white/55">{k}</dt>
              <dd className="flex items-center gap-2 text-right font-semibold">
                {v} <Check className="h-4 w-4 shrink-0 text-crimson-glow" aria-hidden />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default function Engines() {
  return (
    <section id="como-funciona" className="section scroll-mt-16">
      <div className="wrap">
        <Reveal className="text-center">
          <p className="eyebrow">Cómo funciona</p>
          <h2 className="h2 mx-auto mt-3 max-w-3xl">Un plan. Dos motores.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
            Una parte de tu aporte paga la <b className="text-white">protección</b>. La otra se convierte en <b className="text-white">ahorro</b> invertido
            en uno de los índices más diversificados del mundo. Es una inversión de largo plazo, pensada con disciplina.
          </p>
        </Reveal>
        <Flow />
        <Timeline />
      </div>
    </section>
  );
}

import Reveal from '../components/Reveal';
import { FRAMES } from '../config';

const POINTS = [
  ['01', 'Protección desde el día uno', 'Una parte de tu aporte paga un seguro de vida: si algo te pasa, tu familia tiene respaldo cuando más lo necesita.*'],
  ['02', 'Ahorro invertido en el S&P 500', 'La otra parte se ahorra e invierte a largo plazo en un ETF del índice de las 500 empresas más grandes de EE. UU.'],
  ['03', 'Un horizonte de 10 años', 'Diseñado para que en 10 años recuperes el costo de la protección (según condiciones del plan) y te quedes con tu capital.'],
];

export default function QueEs() {
  return (
    <section id="que-es" className="section">
      <div className="wrap grid items-center gap-14 md:grid-cols-[1fr_.85fr]">
        <Reveal>
          <p className="eyebrow">Qué es</p>
          <h2 className="h2 mt-3 max-w-xl">Protección y ahorro, en un solo plan.</h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-graphite/65">
            El Blindaje Patrimonial es un seguro de vida con ahorro e inversión a largo plazo. Tu capital queda protegido
            desde el primer día, y lo que ahorras se construye hacia la meta que tú elijas.
          </p>
          <ol className="mt-10 space-y-7">
            {POINTS.map(([n, t, d]) => (
              <li key={n} className="flex gap-5">
                <span className="num font-mono text-sm font-bold text-crimson-glow">{n}</span>
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight">{t}</h3>
                  <p className="mt-1 leading-relaxed text-graphite/60">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal i={1} className="relative mx-auto grid w-full max-w-[440px] grid-cols-2 gap-4">
          <figure className="bezel overflow-hidden rounded-3xl bg-dark-light" style={{ ['--bezel-o' as string]: 0.55 }}>
            <img src={FRAMES.dosMotores} alt="Un plan, dos motores: seguro y ahorro en el índice S&P 500" loading="lazy"
              width={540} height={675} className="aspect-[4/5] w-full object-cover object-top" />
          </figure>
          <figure className="bezel mt-12 overflow-hidden rounded-3xl bg-dark-light" style={{ ['--bezel-o' as string]: 0.55 }}>
            <img src={FRAMES.liquidezActivos} alt="¿Cuánto tarda en volverse efectivo? Casa, CDT, acciones" loading="lazy"
              width={540} height={675} className="aspect-[4/5] w-full object-cover object-top" />
          </figure>
          <p className="col-span-2 text-center font-mono text-[10px] uppercase tracking-widest text-graphite/35">Escenas de los videos de Caro</p>
        </Reveal>
      </div>
    </section>
  );
}

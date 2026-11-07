import { Droplets, HandCoins, TrendingDown, Compass } from 'lucide-react';
import Reveal from '../components/Reveal';

const PAINS = [
  { icon: Droplets, t: 'Tienes patrimonio, pero no liquidez', d: 'La casa tarda meses en venderse, el CDT está atado a su plazo y las acciones pueden estar abajo justo ese día. Si te pasa algo, tu familia se queda sin efectivo.' },
  { icon: HandCoins, t: '“El seguro es plata perdida”', d: 'Pagas cada mes por algo que esperas no usar nunca, y al final no te queda nada. Así se siente un seguro tradicional.' },
  { icon: TrendingDown, t: 'Tus ahorros pierden contra la inflación', d: 'El peso se devalúa y la cuenta de ahorros apenas se mueve. Quieres exposición al dólar y al mundo, pero no sabes por dónde empezar.' },
  { icon: Compass, t: 'Metas grandes, sin plan', d: 'Tu jubilación, la universidad de tus hijos, “invertir algún día”… todo está en la lista, pero nada tiene fecha ni números.' },
];

export default function Pains() {
  return (
    <section className="section bg-dark-light">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">¿Te suena?</p>
          <h2 className="h2 mt-3 max-w-3xl">Haces las cosas bien… y aun así tu familia no está blindada.</h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {PAINS.map((p, i) => (
            <Reveal key={p.t} i={i} className="bezel bezel-hover rounded-2xl border border-white/[.07] bg-dark p-6">
              <p.icon className="h-7 w-7 text-crimson" aria-hidden />
              <h3 className="mt-4 text-xl font-extrabold tracking-tight">{p.t}</h3>
              <p className="mt-2 leading-relaxed text-white/65">{p.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

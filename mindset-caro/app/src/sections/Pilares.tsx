import { ShieldCheck, TrendingUp, Brain } from 'lucide-react';
import Reveal from '../components/Reveal';
import { useUi } from '../ui';

/** The three pillars from the original mindsetcaro.com, kept as the brand's roots.
 *  CMS keys `pillars.p{1..3}.title|desc` still override the copy, as on the old site. */
const PILLARS = [
  { icon: ShieldCheck, k: 'p1', t: 'Blindaje Patrimonial', d: 'Protege lo que has construido y la tranquilidad de tu familia frente a lo inesperado, desde el primer día.' },
  { icon: TrendingUp, k: 'p2', t: 'Libertad Financiera', d: 'Ahorro disciplinado e interés compuesto a largo plazo, con metas claras para tu retiro y tus proyectos.' },
  { icon: Brain, k: 'p3', t: 'Mindset y Ventas', d: 'La mentalidad correcta y las habilidades para vender, negociar y hacer crecer tus ingresos.' },
];

export default function Pilares() {
  const { cms } = useUi();
  return (
    <section id="pilares" className="section border-t border-graphite/10">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">Mindset Caro</p>
          <h2 className="h2 mt-3 max-w-3xl">Tus 3 pilares de crecimiento.</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-graphite/65">
            El éxito verdadero necesita una base sólida. Nos enfocamos en las áreas que de verdad transforman tu realidad.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.k} i={i} className="group rounded-2xl border border-graphite/10 bg-dark-lighter p-6 transition-all duration-300 hover:-translate-y-1 hover:border-crimson/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-crimson/10 text-crimson transition-colors group-hover:bg-crimson/20">
                <p.icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mt-5 text-xl font-extrabold tracking-tight text-graphite">{String(cms?.[`pillars.${p.k}.title`] || p.t)}</h3>
              <p className="mt-2 leading-relaxed text-graphite/65">{String(cms?.[`pillars.${p.k}.desc`] || p.d)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

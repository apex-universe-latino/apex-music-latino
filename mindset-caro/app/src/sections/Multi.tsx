import { Sunset, GraduationCap, DollarSign } from 'lucide-react';
import Reveal from '../components/Reveal';

const GOALS = [
  { id: 'jubilacion', icon: Sunset, t: 'Tu jubilación', d: 'Construye el capital para retirarte con tranquilidad, sin depender solo de la pensión.' },
  { id: 'educacion', icon: GraduationCap, t: 'La educación de tus hijos', d: 'Que la universidad sea un plan con fecha y números, no una preocupación.' },
  { id: 'dolares', icon: DollarSign, t: 'Invertir en dólares', d: 'Tu ahorro, invertido a largo plazo en las 500 empresas más grandes de EE. UU. a través de un índice. Protección frente a la devaluación del peso, sin promesas de rentabilidad.' },
];

export default function Multi() {
  return (
    <section id="metas" className="section bg-bone text-dark">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow !text-crimson">Metas · multipropósito</p>
          <h2 className="h2 mt-3 max-w-3xl">Un mismo blindaje. El destino lo eliges tú.</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-dark/70">
            Tu capital queda protegido desde el día uno, y lo que vas ahorrando se construye hacia la visión que tú quieras.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {GOALS.map((g, i) => (
            <Reveal key={g.t} i={i} className="group rounded-2xl border border-dark/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl">
              <div id={g.id} className="scroll-mt-28" />
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-crimson text-white">
                <g.icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mt-5 text-xl font-extrabold tracking-tight">{g.t}</h3>
              <p className="mt-2 leading-relaxed text-dark/65">{g.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

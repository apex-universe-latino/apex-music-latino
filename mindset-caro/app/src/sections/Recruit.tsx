import { Users } from 'lucide-react';
import Reveal from '../components/Reveal';
import { useUi } from '../ui';

export default function Recruit() {
  const { openBot } = useUi();
  return (
    <section className="border-t border-white/10 px-4 py-14 sm:px-6">
      <Reveal className="wrap flex flex-col items-start gap-5 rounded-3xl border border-white/10 bg-dark-light p-6 sm:flex-row sm:items-center sm:p-8">
        <Users className="h-10 w-10 shrink-0 text-crimson" aria-hidden />
        <div className="flex-1">
          <p className="eyebrow">Trabaja con Caro</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight">¿Te apasiona ayudar a familias a proteger su patrimonio?</h2>
          <p className="mt-2 text-white/65">Caro está formando un equipo de asesores en Colombia. Te enseña su método y te acompaña.</p>
        </div>
        <button type="button" onClick={() => openBot('recruit')} className="btn-ghost w-full sm:w-auto">Quiero saber más</button>
      </Reveal>
    </section>
  );
}

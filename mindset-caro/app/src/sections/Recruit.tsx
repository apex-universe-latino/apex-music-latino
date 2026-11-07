import { ArrowUpRight, Briefcase, Users } from 'lucide-react';
import Reveal from '../components/Reveal';
import { COMMUNITY_URL } from '../config';
import { useUi } from '../ui';

/** Secondary paths, quiet on purpose: community sign-up (her CUBO page) and "Trabaja con Caro".
 *  Neither competes with the diagnostic CTA. */
export default function Recruit() {
  const { openBot } = useUi();
  return (
    <section id="trabaja" className="px-4 pb-20 pt-4 sm:px-6">
      <div className="wrap grid gap-4 md:grid-cols-2">
        <Reveal id="comunidad">
          <a href={COMMUNITY_URL}
            className="bezel bezel-hover group flex h-full items-start gap-5 rounded-3xl border border-white/[.07] bg-dark-light p-6 sm:p-8">
            <Users className="h-8 w-8 shrink-0 text-crimson" aria-hidden />
            <span className="flex-1">
              <span className="eyebrow block">Comunidad</span>
              <span className="mt-2 block text-xl font-black tracking-tight">Únete a la comunidad Mindset Caro</span>
              <span className="mt-2 block text-white/60">Contenidos, eventos y respuestas de Caro sobre protección, ahorro e inversión.</span>
            </span>
            <ArrowUpRight className="h-5 w-5 shrink-0 text-white/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </a>
        </Reveal>
        <Reveal i={1}>
          <button type="button" onClick={() => openBot('recruit')}
            className="bezel bezel-hover group flex h-full w-full items-start gap-5 rounded-3xl border border-white/[.07] bg-dark-light p-6 text-left sm:p-8">
            <Briefcase className="h-8 w-8 shrink-0 text-white/50" aria-hidden />
            <span className="flex-1">
              <span className="eyebrow block !text-white/50">Trabaja con Caro</span>
              <span className="mt-2 block text-xl font-black tracking-tight">¿Te apasiona ayudar a familias a proteger su patrimonio?</span>
              <span className="mt-2 block text-white/60">Caro está formando un equipo de asesores en Colombia. Te enseña su método y te acompaña.</span>
            </span>
            <ArrowUpRight className="h-5 w-5 shrink-0 text-white/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

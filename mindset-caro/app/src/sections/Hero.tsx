import { ArrowRight } from 'lucide-react';
import Shield from './Shield';
import CaroCta from '../components/CaroCta';
import { HERO_PHOTO } from '../config';
import { cmsText, useUi } from '../ui';

export default function Hero() {
  const { cms, openDiagnostic } = useUi();
  const sub = cmsText(cms, 'blindaje.hero.subtitle', 'Asegura tu capital desde el día uno.');
  const body = cmsText(cms, 'blindaje.hero.body',
    'Un solo plan, dos motores: protección para tu familia desde el primer día y ahorro disciplinado invertido a largo plazo en el índice S&P 500. Tú eliges la meta: jubilación, la educación de tus hijos o hacer crecer tu dinero.');
  const photo = cmsText(cms, 'blindaje.hero.photo', HERO_PHOTO);

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-crimson/20 blur-[120px]" />
      <div className="wrap relative grid items-center gap-10 md:grid-cols-[1.15fr_.85fr]">
        <div>
          <p className="eyebrow mb-5">Mindset Caro · Carolina Veci</p>
          <h1 className="text-[3.3rem] font-black leading-[.92] tracking-[-0.045em] sm:text-7xl lg:text-[5.6rem]">
            <span className="kin-w" style={{ ['--i' as string]: 0 }}>Blindaje</span>{' '}
            <span className="kin-w bg-gradient-to-r from-crimson to-crimson-glow bg-clip-text text-transparent" style={{ ['--i' as string]: 1 }}>
              Patrimonial
            </span>
          </h1>
          <p className="mt-5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{sub}</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">{body}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={openDiagnostic} className="btn-primary group">
              Haz tu diagnóstico gratis
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
            </button>
            <CaroCta />
          </div>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-white/50">3 minutos · Sin costo · Resultado al instante</p>
        </div>

        <div className="relative mx-auto w-full max-w-[300px] sm:max-w-[360px]">
          {photo ? (
            <div className="relative overflow-hidden rounded-3xl border border-white/10">
              <img src={photo} alt="Carolina Veci, asesora de Blindaje Patrimonial" className="aspect-[4/5] w-full object-cover"
                width={720} height={900} fetchPriority="high" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-dark to-transparent" />
              <Shield className="absolute -bottom-6 -right-6 w-32 drop-shadow-2xl" />
            </div>
          ) : (
            <Shield className="w-full drop-shadow-[0_30px_60px_rgba(230,0,0,.25)]" />
          )}
          <div className="mt-4 grid grid-cols-2 gap-3 font-mono text-[11px] uppercase tracking-wider">
            <div className="rounded-xl border border-crimson/40 bg-crimson/10 px-3 py-2 text-center">Día 1 · protección activa</div>
            <div className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-center">Año 10 · tu capital + rendimientos*</div>
          </div>
        </div>
      </div>
    </section>
  );
}

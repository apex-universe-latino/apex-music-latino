import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import CaroCta from '../components/CaroCta';
import { BIO, HERO_LOOP, HERO_PHOTO, HERO_POSTER, RETIRED_ASSET_RE } from '../config';
import { prefersReducedMotion } from '../hooks/motion';
import { cmsText, useUi } from '../ui';

export default function Hero() {
  const { cms, openDiagnostic } = useUi();
  const sub = cmsText(cms, 'blindaje.hero.subtitle', 'Asegura tu capital desde el día uno.');
  const body = cmsText(cms, 'blindaje.hero.body',
    'Un solo plan, dos motores: protección para tu familia desde el primer día y ahorro disciplinado invertido a largo plazo en el índice S&P 500.');
  const cmsPhoto = cmsText(cms, 'blindaje.hero.photo', HERO_PHOTO);
  const photo = RETIRED_ASSET_RE.test(cmsPhoto) ? HERO_PHOTO : cmsPhoto;

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-10 sm:px-6 sm:pb-28 sm:pt-20">
      <div aria-hidden className="pointer-events-none absolute -top-48 right-[-10%] h-[520px] w-[720px] rounded-full bg-crimson/[.13] blur-[130px]" />
      <div className="wrap relative grid items-center gap-12 md:grid-cols-[1.1fr_.9fr] lg:gap-16">
        <div>
          <p className="eyebrow mb-6 !text-white/55">Seguro de vida · ahorro · inversión</p>
          <h1 className="text-[3.1rem] font-black leading-[.92] tracking-[-0.045em] min-[400px]:text-[3.4rem] sm:text-7xl lg:text-[5.4rem]">
            <span className="kin-w" style={{ ['--i' as string]: 0 }}>Blindaje</span>{' '}
            <span className="kin-w text-crimson" style={{ ['--i' as string]: 1 }}>Patrimonial</span>
          </h1>
          <p className="mt-6 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{sub}</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">{body}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={openDiagnostic} className="btn-primary group">
              Haz tu diagnóstico gratis
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
            </button>
            <CaroCta />
          </div>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">3 minutos · Sin costo · Resultado al instante</p>
          <p className="mt-8 max-w-md border-l border-white/15 pl-4 text-sm leading-relaxed text-white/55">{BIO}</p>
        </div>

        <HeroVisual photo={photo} />
      </div>
    </section>
  );
}

/** PHOTO SLOT (CMS `blindaje.hero.photo` / config HERO_PHOTO). Only Carolina's real photo goes
 *  here. Without it: the shield loop from her Blindaje video, never a stock or AI person. */
function HeroVisual({ photo }: { photo: string }) {
  const vid = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = vid.current;
    if (!v || prefersReducedMotion()) return;
    v.play().catch(() => { /* autoplay blocked: poster stays */ });
  }, [photo]);

  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <div data-slot="blindaje.hero.photo" data-filled={photo ? 'yes' : 'no'}
        className="bezel relative aspect-[4/5] overflow-hidden rounded-[28px] bg-dark-light" style={{ ['--bezel-o' as string]: 0.9 }}>
        {photo ? (
          <img src={photo} alt="Carolina, Mindset Caro" className="h-full w-full object-cover" width={720} height={900} fetchPriority="high" />
        ) : (
          <video ref={vid} src={HERO_LOOP} poster={HERO_POSTER} muted loop playsInline preload="metadata" aria-hidden
            className="h-full w-full object-cover" style={{ objectPosition: '100% 50%' }} />
        )}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-dark via-dark/60 to-transparent" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="grid grid-cols-2 gap-2 font-mono text-[10.5px] uppercase leading-snug tracking-wider">
            <div className="rounded-xl border border-crimson/40 bg-dark/70 px-3 py-2.5 backdrop-blur">
              <span className="block text-crimson-glow">Día 1</span>Protección activa
            </div>
            <div className="rounded-xl border border-white/15 bg-dark/70 px-3 py-2.5 backdrop-blur">
              <span className="block text-white/50">Año 10</span>Tu capital + rendimientos*
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-right font-mono text-[10px] uppercase tracking-widest text-white/35">*Ilustrativo · según condiciones del plan</p>
    </div>
  );
}

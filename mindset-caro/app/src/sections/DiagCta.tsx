import { ArrowRight } from 'lucide-react';
import Reveal from '../components/Reveal';
import CaroCta from '../components/CaroCta';
import { useInView, useCountUp } from '../hooks/motion';
import { useUi } from '../ui';

const BULLETS = ['Tu puntaje: ¿qué tan blindado estás?', 'Tu brecha de protección estimada', 'Una proyección ilustrativa de tu ahorro a 10 años', 'Tu Mapa de Blindaje por WhatsApp'];

export default function DiagCta() {
  const { openDiagnostic } = useUi();
  const [ref, seen] = useInView<HTMLDivElement>(0.4);
  const v = useCountUp(5, seen, 900);
  return (
    <section id="diagnostico" className="section relative overflow-hidden bg-gradient-to-br from-crimson-deep via-dark to-dark">
      <div aria-hidden className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-crimson/30 blur-[120px]" />
      <div className="wrap relative grid items-center gap-10 md:grid-cols-2">
        <Reveal>
          <p className="eyebrow !text-graphite/80">Diagnóstico gratis · 3 minutos</p>
          <h2 className="h2 mt-3">¿Qué tan blindado estás?</h2>
          <p className="mt-4 text-lg leading-relaxed text-graphite/80">
            Responde 5 preguntas sencillas, sin datos de salud ni documentos, y recibe al instante:
          </p>
          <ul className="mt-5 space-y-2">
            {BULLETS.map((b) => (
              <li key={b} className="flex items-start gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-crimson-glow" />{b}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={openDiagnostic} className="btn-primary">Haz tu diagnóstico gratis <ArrowRight className="h-5 w-5" /></button>
            <CaroCta />
          </div>
        </Reveal>
        <div ref={ref} className="mx-auto">
          <div className="relative flex h-60 w-60 items-center justify-center rounded-full border border-graphite/15 bg-dark/60 sm:h-72 sm:w-72">
            <div className="absolute inset-3 rounded-full border-2 border-dashed border-crimson/40" />
            <div className="text-center">
              <p className="num font-mono text-7xl font-bold sm:text-8xl">{Math.round(v)}</p>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-graphite/60">preguntas</p>
              <p className="mt-2 text-sm font-semibold text-graphite/80">y sabes dónde estás parado</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

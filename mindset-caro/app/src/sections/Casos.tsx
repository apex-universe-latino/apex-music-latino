import { Play } from 'lucide-react';
import Reveal from '../components/Reveal';
import { CASOS, RETIRED_ASSET_RE, type Caso } from '../config';
import { useUi } from '../ui';

/** One upcoming commercial per persona. ILLUSTRATIVE characters (not clients). The mp4 slot per
 *  card is `src` in config CASOS or CMS `blindaje.casos` ([{id, src}]). */
export default function Casos() {
  const { cms, openDiagnostic } = useUi();
  let overrides: Array<{ id?: string; src?: string }> = [];
  try {
    const raw = cms?.['blindaje.casos'];
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (Array.isArray(parsed)) overrides = parsed;
  } catch { /* keep config */ }
  const casos: Caso[] = CASOS.map((c) => {
    const o = overrides.find((x) => x?.id === c.id);
    const src = typeof o?.src === 'string' && !RETIRED_ASSET_RE.test(o.src) ? o.src : c.src;
    return { ...c, src };
  });

  return (
    <section id="casos" className="section">
      <div className="wrap">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Casos</p>
            <h2 className="h2 mt-3 max-w-2xl">Tres vidas. Un mismo blindaje.</h2>
          </div>
          <p className="max-w-sm text-graphite/55">Cada persona arma su plan hacia una meta distinta. Personajes ilustrativos, no clientes reales.</p>
        </Reveal>

        <div className="-mx-4 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {casos.map((c, i) => (
            <Reveal key={c.id} i={i} className="w-[78%] shrink-0 snap-start min-[480px]:w-[300px] md:w-auto">
              <article>
                <div className="bezel relative overflow-hidden rounded-3xl bg-dark-light" style={{ ['--bezel-o' as string]: 0.6 }}>
                  {c.src ? (
                    <video src={c.src} poster={c.poster} controls playsInline preload="none"
                      className="aspect-[4/5] w-full object-cover" aria-label={`Caso ilustrativo: ${c.name}`} />
                  ) : (
                    <>
                      <img src={c.poster} alt="" aria-hidden loading="lazy" width={540} height={675}
                        className="aspect-[4/5] w-full object-cover object-top opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/30 to-transparent" aria-hidden />
                      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-4">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-graphite/25 bg-dark/60 backdrop-blur">
                          <Play className="ml-0.5 h-4 w-4" aria-hidden />
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-widest text-graphite/70">Video próximamente</span>
                      </div>
                    </>
                  )}
                  <span className="absolute left-3 top-3 z-[3] rounded-full border border-graphite/20 bg-dark/75 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest backdrop-blur">
                    Caso ilustrativo
                  </span>
                </div>
                <h3 className="mt-5 text-2xl font-black tracking-tight">{c.name}, {c.age}</h3>
                <p className="font-mono text-[11px] uppercase tracking-widest text-graphite/45">{c.who}</p>
                <p className="mt-3 leading-relaxed text-graphite/65">{c.need}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {c.goals.map((g) => (
                    <li key={g} className="rounded-full border border-graphite/12 px-3 py-1 text-xs font-semibold text-graphite/70">{g}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <button type="button" onClick={openDiagnostic} className="btn-ghost">¿Cuál es tu caso? Haz el diagnóstico</button>
          <p className="text-xs text-graphite/40">Casos ilustrativos. Las cifras y condiciones reales dependen de cada póliza y de la aseguradora.</p>
        </Reveal>
      </div>
    </section>
  );
}

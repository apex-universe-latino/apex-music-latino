import { VIDEOS, type VideoItem } from '../config';
import { useUi } from '../ui';
import Reveal from '../components/Reveal';

/** Slot for the vertical (9:16) explainer videos. Renders nothing until videos exist
 *  (config VIDEOS or CMS key `blindaje.videos` as a JSON array of {src, poster?, title}). */
export default function Videos() {
  const { cms } = useUi();
  let items: VideoItem[] = VIDEOS;
  const raw = cms?.['blindaje.videos'];
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (Array.isArray(parsed) && parsed.length) items = parsed.filter((v) => v && typeof v.src === 'string');
  } catch { /* keep config */ }
  if (!items.length) return null;
  return (
    <section className="section border-t border-graphite/10">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">Caro te lo explica</p>
          <h2 className="h2 mt-3">En menos de un minuto.</h2>
        </Reveal>
        <div className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
          {items.map((v) => (
            <figure key={v.src} className="w-[240px] shrink-0 snap-start sm:w-[270px]">
              <video src={v.src} poster={v.poster} controls playsInline preload="none"
                className="aspect-[9/16] w-full rounded-2xl border border-graphite/10 bg-dark-lighter object-cover" />
              <figcaption className="mt-2 text-sm font-semibold text-graphite/80">{v.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

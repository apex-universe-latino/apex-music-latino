// Tiny motion helpers (no animation library — keeps the bundle light for LCP on Meta traffic).
// Ported from the HyperFrames work: per-word blur-in, eased count-up with a landing pulse,
// stroke "draw-on" for lines, and staggered reveals. All of it respects prefers-reduced-motion.
import { useEffect, useRef, useState } from 'react';

export const prefersReducedMotion = () => {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
};

/** true once the element has scrolled into view (fires once). */
export function useInView<T extends Element>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (!('IntersectionObserver' in window)) { setSeen(true); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }),
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, threshold]);
  return [ref, seen] as const;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Count from 0 to `end` when `start` flips true. */
export function useCountUp(end: number, start: boolean, ms = 1200) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (prefersReducedMotion()) { setV(end); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      setV(end * easeOutCubic(k));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, start, ms]);
  return v;
}

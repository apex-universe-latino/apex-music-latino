import type { CSSProperties, ReactNode } from 'react';
import { useInView } from '../hooks/motion';

/** Adds `.is-in` when scrolled into view. Children with `.reveal`, `.draw`, `.meter-fill`
 *  animate off that class. With `self`, the wrapper itself fades up. */
export default function Reveal({ children, className = '', self = true, i = 0, threshold = 0.2, style, id }: {
  children: ReactNode; id?: string; className?: string; self?: boolean; i?: number; threshold?: number; style?: CSSProperties;
}) {
  const [ref, seen] = useInView<HTMLDivElement>(threshold);
  return (
    <div ref={ref} id={id} className={`${self ? 'reveal' : ''} ${seen ? 'is-in' : ''} ${className}`}
      style={{ ['--i' as string]: i, ...style }}>
      {children}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useUi } from '../ui';

/** Mobile-only bottom bar that appears after the hero scrolls away. */
export default function StickyCta() {
  const { openDiagnostic } = useUi();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 520);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <div className={`fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-dark/95 p-3 backdrop-blur transition-transform duration-300 sm:hidden ${show ? 'translate-y-0' : 'translate-y-full'}`}>
      <button type="button" onClick={openDiagnostic} className="btn-primary w-full pr-20">Haz tu diagnóstico gratis</button>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';

/** Floating "Caro IA" bubble. Tiny on purpose: the chat panel itself is lazy-loaded on first open. */
export default function BotBubble({ hidden, onOpen }: { hidden: boolean; onOpen: () => void }) {
  const [hint, setHint] = useState(false);
  // On phones the bubble waits until the hero CTA has scrolled away, so it never covers it.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 520 || window.innerWidth >= 640);
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, []);
  useEffect(() => {
    let seen = false;
    try { seen = Boolean(sessionStorage.getItem('mc_bot_hint')); } catch { /* ignore */ }
    if (seen) return;
    const t = window.setTimeout(() => { setHint(true); try { sessionStorage.setItem('mc_bot_hint', '1'); } catch { /* ignore */ } }, 9000);
    return () => window.clearTimeout(t);
  }, []);
  if (hidden || !scrolled) return null;
  return (
    <div className="fixed bottom-24 right-4 z-40 flex items-end gap-2 sm:bottom-6 sm:right-6">
      {hint && (
        <button type="button" onClick={() => { setHint(false); onOpen(); }}
          className="step-in mb-1 max-w-[220px] rounded-2xl rounded-br-md bg-white px-4 py-3 text-left text-sm font-semibold text-dark shadow-xl">
          ¿Tienes dudas sobre el Blindaje Patrimonial? Pregúntame.
        </button>
      )}
      <button type="button" onClick={() => { setHint(false); onOpen(); }} aria-label="Abrir chat con Caro IA"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-crimson text-white shadow-[0_10px_30px_-5px_rgba(230,0,0,.7)] hover:bg-crimson-glow">
        <MessageCircle className="h-7 w-7" />
        <span className="absolute -top-1 -right-1 rounded-full bg-white px-1.5 py-0.5 font-mono text-[9px] font-bold text-crimson">IA</span>
      </button>
    </div>
  );
}

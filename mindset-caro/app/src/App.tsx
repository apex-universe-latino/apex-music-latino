import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import Landing from './pages/Landing';
import Privacidad from './pages/Privacidad';
import Footer from './sections/Footer';
import BotBubble from './components/BotBubble';
import StickyCta from './components/StickyCta';
import { UiContext, type BotIntent, type Cms } from './ui';
import { bumpVisit } from './lib/profile';
import { captureUtm, setContactOverrides, track } from './lib/lead';

const Diagnostic = lazy(() => import('./components/Diagnostic'));
const CaroBot = lazy(() => import('./components/CaroBot'));
const preloadDiagnostic = () => import('./components/Diagnostic');

function BlogPostWrapper() {
  const { slug } = useParams();
  return <BlogPost slug={slug || ''} apiBase="" />;
}

function DiagnosticoPage() {
  return (
    <div className="px-4 pb-20 pt-6 sm:pt-10">
      <div className="mx-auto max-w-xl">
        <Suspense fallback={<div className="h-[60vh]" />}>
          <Diagnostic variant="page" />
        </Suspense>
      </div>
    </div>
  );
}

export default function App() {
  const [cms, setCms] = useState<Cms>(null);
  const [diagOpen, setDiagOpen] = useState(false);
  const [bot, setBot] = useState<{ open: boolean; intent: BotIntent; loaded: boolean }>({ open: false, intent: 'default', loaded: false });
  const { pathname } = useLocation();

  useEffect(() => {
    captureUtm();
    bumpVisit();
    // Optional CMS overrides (Carolina edits these at /cms). The page never waits on it.
    fetch('/api/mc-content?site=landing')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.content) return;
        setContactOverrides({ whatsapp: d.content['contact.whatsapp'], booking: d.content['contact.booking_url'] });
        setCms(d.content);
      })
      .catch(() => {});
    // Warm the diagnostic chunk once the page is idle so the first tap opens instantly.
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback;
    if (idle) idle(() => preloadDiagnostic()); else setTimeout(preloadDiagnostic, 2500);
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  const openDiagnostic = useCallback(() => {
    track('ViewContent', { content_name: 'diagnostico' });
    setDiagOpen(true);
  }, []);
  const openBot = useCallback((intent: BotIntent = 'default') => setBot({ open: true, intent, loaded: true }), []);
  const ui = useMemo(() => ({ cms, openDiagnostic, openBot }), [cms, openDiagnostic, openBot]);

  useEffect(() => {
    document.body.style.overflow = diagOpen ? 'hidden' : '';
  }, [diagOpen]);

  return (
    <UiContext.Provider value={ui}>
      <div className="min-h-screen bg-dark text-white">
        <nav className="fixed top-0 z-40 w-full border-b border-white/10 bg-dark/85 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link to="/" className="text-xl font-black tracking-tighter" aria-label="Mindset Caro — inicio">
              MINDSET<span className="text-crimson">CARO</span>
            </Link>
            <div className="flex items-center gap-4 sm:gap-6">
              {pathname === '/' && (
                <a href="#como-funciona" className="hidden text-sm font-semibold text-white/70 hover:text-white md:inline">¿Cómo funciona?</a>
              )}
              <Link to="/blog" className="hidden text-sm font-semibold text-white/70 hover:text-white min-[400px]:inline">Blog</Link>
              <button onClick={openDiagnostic} onMouseEnter={preloadDiagnostic}
                className="whitespace-nowrap rounded-full bg-crimson px-4 py-2 text-sm font-extrabold text-white hover:bg-crimson-glow">
                Diagnóstico<span className="hidden sm:inline"> gratis</span>
              </button>
            </div>
          </div>
        </nav>

        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/diagnostico" element={<DiagnosticoPage />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="/blog" element={<BlogList apiBase="" />} />
            <Route path="/blog/:slug" element={<BlogPostWrapper />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </main>

        <Footer />
        {pathname !== '/diagnostico' && <StickyCta />}

        {diagOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-dark/95 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Diagnóstico de Blindaje Patrimonial">
            <div className="mx-auto min-h-full max-w-xl px-4 py-6 sm:py-12">
              <Suspense fallback={<div className="h-[60vh]" />}>
                <Diagnostic variant="modal" onClose={() => setDiagOpen(false)} />
              </Suspense>
            </div>
          </div>
        )}

        <BotBubble hidden={bot.open} onOpen={() => openBot('default')} />
        {bot.loaded && (
          <Suspense fallback={null}>
            <CaroBot open={bot.open} intent={bot.intent} onClose={() => setBot((b) => ({ ...b, open: false }))} />
          </Suspense>
        )}
      </div>
    </UiContext.Provider>
  );
}

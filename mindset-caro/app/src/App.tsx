import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Routes, Route, useParams, useLocation } from 'react-router-dom';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import Landing from './pages/Landing';
import Privacidad from './pages/Privacidad';
import Footer from './sections/Footer';
import BotBubble from './components/BotBubble';
import StickyCta from './components/StickyCta';
import SiteHeader from './components/SiteHeader';
import { RETIRED_ASSET_RE } from './config';
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
    // Optional CMS overrides (Carolina edits these at /cms). The page never waits on it and
    // renders fully from in-code defaults when the CMS is slow, empty or down.
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), 4000);
    fetch('/api/mc-content?site=landing', { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const raw = d?.content;
        if (!raw || typeof raw !== 'object') return;
        // Drop any value that still points at the retired Apex Music project (assets gone).
        const content = Object.fromEntries(Object.entries(raw as Record<string, unknown>)
          .filter(([, v]) => !(typeof v === 'string' && RETIRED_ASSET_RE.test(v))));
        if (!Object.keys(content).length) return;
        setContactOverrides({ whatsapp: content['contact.whatsapp'] as string, booking: content['contact.booking_url'] as string });
        setCms(content);
      })
      .catch(() => {})
      .finally(() => window.clearTimeout(timer));
    // Warm the diagnostic chunk once the page is idle so the first tap opens instantly.
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback;
    if (idle) idle(() => preloadDiagnostic()); else setTimeout(preloadDiagnostic, 2500);
  }, []);

  useEffect(() => { if (!window.location.hash) window.scrollTo(0, 0); }, [pathname]);

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
        <SiteHeader />

        <main className="pt-[65px]">
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

import { useCallback, useEffect, useId, useRef, useState, type ComponentType } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight, ChevronDown, Menu, X, ShieldCheck, Workflow, Layers, Droplets, Sunset, GraduationCap, DollarSign,
  PlayCircle, BookOpen, Users, MessageCircle, Briefcase, type LucideProps,
} from 'lucide-react';
import Brand from './Brand';
import { COMMUNITY_URL, FRAMES, HERO_POSTER } from '../config';
import { caroWhatsappLink } from '../lib/lead';
import { useGoToSection } from '../lib/nav';
import { useUi } from '../ui';

type Icon = ComponentType<LucideProps>;
type Item = { label: string; desc: string; section: string; icon: Icon };
type Group = { id: 'blindaje' | 'metas'; label: string; items: Item[] };

const GROUPS: Group[] = [
  {
    id: 'blindaje', label: 'Blindaje Patrimonial', items: [
      { label: 'Qué es', desc: 'Protección y ahorro en un solo plan', section: 'que-es', icon: ShieldCheck },
      { label: 'Cómo funciona', desc: 'El horizonte de 10 años, paso a paso', section: 'como-funciona', icon: Workflow },
      { label: 'Los dos motores', desc: 'Seguro de vida + ahorro en el S&P 500', section: 'motores', icon: Layers },
      { label: 'Liquidez para tu familia', desc: 'Dinero cuando más se necesita', section: 'liquidez', icon: Droplets },
    ],
  },
  {
    id: 'metas', label: 'Metas', items: [
      { label: 'Jubilación', desc: 'Tu capital para retirarte tranquilo', section: 'jubilacion', icon: Sunset },
      { label: 'Educación de tus hijos', desc: 'La universidad con fecha y números', section: 'educacion', icon: GraduationCap },
      { label: 'Invertir en dólares', desc: 'Exposición a las 500 empresas más grandes de EE. UU.', section: 'dolares', icon: DollarSign },
    ],
  },
];

const WA_TEXT = 'Hola Caro, quiero saber más sobre el Blindaje Patrimonial.';

export default function SiteHeader() {
  const { openDiagnostic, openBot } = useUi();
  const goTo = useGoToSection();
  const { pathname } = useLocation();
  const [open, setOpen] = useState<Group['id'] | null>(null);
  const [drawer, setDrawer] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeTimer = useRef<number | undefined>(undefined);
  const uid = useId();

  const close = useCallback((focusTrigger = false) => {
    setOpen((cur) => {
      if (focusTrigger && cur) triggerRefs.current[cur]?.focus();
      return null;
    });
  }, []);

  // Esc closes everything; click outside closes the panel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (drawer) setDrawer(false);
      close(true);
    };
    const onDown = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); };
  }, [close, drawer]);

  // Close menus when the route changes (state adjusted during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) { setLastPath(pathname); setOpen(null); setDrawer(false); }
  useEffect(() => {
    document.documentElement.style.overflow = drawer ? 'hidden' : '';
    return () => { document.documentElement.style.overflow = ''; };
  }, [drawer]);

  // Hover opens; a click right after a hover-open must not toggle it shut again.
  const hoverAt = useRef(0);
  const hoverOpen = (id: Group['id'], at: number) => { window.clearTimeout(closeTimer.current); hoverAt.current = at; setOpen(id); };
  const clickToggle = (id: Group['id'], at: number) => {
    const fromHover = at - hoverAt.current < 500;
    setOpen((cur) => (cur === id && !fromHover ? null : id));
  };
  const hoverClose = () => { window.clearTimeout(closeTimer.current); closeTimer.current = window.setTimeout(() => setOpen(null), 180); };

  const go = (section: string) => { setOpen(null); setDrawer(false); goTo(section); };
  const diag = () => { setOpen(null); setDrawer(false); openDiagnostic(); };
  const talk = () => {
    setOpen(null); setDrawer(false);
    const href = caroWhatsappLink(WA_TEXT);
    if (href) window.open(href, '_blank', 'noopener'); else openBot('talk');
  };
  const recruit = () => { setOpen(null); setDrawer(false); openBot('recruit'); };

  const navLink = 'rounded-full px-3 py-2 text-sm font-semibold text-graphite/70 transition-colors hover:text-graphite focus-visible:text-graphite';

  return (
    <header ref={headerRef} className={`fixed top-0 w-full ${drawer ? 'z-[60]' : 'z-40'}`} onMouseLeave={hoverClose} onMouseEnter={() => window.clearTimeout(closeTimer.current)}>
      <div className="border-b border-white/[.06] bg-dark/80 backdrop-blur-xl">
        <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" aria-label="Mindset Caro — inicio" className="shrink-0"><Brand size="md" /></Link>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {GROUPS.map((g) => (
                <li key={g.id}>
                  <button
                    ref={(el) => { triggerRefs.current[g.id] = el; }}
                    type="button"
                    aria-expanded={open === g.id}
                    aria-controls={`${uid}-${g.id}`}
                    onClick={(e) => clickToggle(g.id, e.timeStamp)}
                    onMouseEnter={(e) => hoverOpen(g.id, e.timeStamp)}
                    className={`${navLink} inline-flex items-center gap-1 ${open === g.id ? 'text-graphite' : ''}`}
                  >
                    {g.id === 'blindaje' ? 'Blindaje' : g.label}
                    <ChevronDown className={`h-4 w-4 transition-transform ${open === g.id ? 'rotate-180' : ''}`} aria-hidden />
                  </button>
                  {open === g.id && (
                    <MegaPanel id={`${uid}-${g.id}`} group={g} onGo={go} onDiag={diag} onTalk={talk} onRecruit={recruit} />
                  )}
                </li>
              ))}
              <li><button type="button" onClick={() => go('casos')} onMouseEnter={hoverClose} className={navLink}>Casos</button></li>
              <li><Link to="/blog" onMouseEnter={hoverClose} className={navLink}>Blog</Link></li>
              <li><a href={COMMUNITY_URL} onMouseEnter={hoverClose} className={navLink}>Comunidad</a></li>
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" onClick={talk} className={`${navLink} hidden xl:inline-flex items-center gap-1.5`}>
              <MessageCircle className="h-4 w-4" aria-hidden /> Habla con Caro
            </button>
            <button type="button" onClick={diag}
              className="btn-primary !min-h-0 !rounded-full !px-4 !py-2 !text-sm whitespace-nowrap">
              <span>Diagnóstico<span className="hidden sm:inline"> gratis</span></span>
            </button>
            <button type="button" onClick={() => setDrawer(true)} aria-label="Abrir menú" aria-expanded={drawer}
              className="-mr-2 rounded-full p-2 text-graphite/80 hover:text-graphite lg:hidden">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      <div className="rainbow-line" aria-hidden />

      {drawer && <Drawer onClose={() => setDrawer(false)} onGo={go} onDiag={diag} onTalk={talk} onRecruit={recruit} />}
    </header>
  );
}

type Actions = { onGo: (s: string) => void; onDiag: () => void; onTalk: () => void; onRecruit: () => void };

function MegaPanel({ id, group, onGo, onDiag, onTalk, onRecruit }: { id: string; group: Group } & Actions) {
  return (
    <div id={id} className="absolute inset-x-0 top-full px-4 pt-3 sm:px-6" role="region" aria-label={group.label}>
      <div className="step-in bezel mx-auto max-w-6xl rounded-3xl border border-white/[.06] bg-[#f5f1e9] p-6 shadow-[0_40px_80px_-20px_rgba(0,0,0,.95)]"
        style={{ ['--bezel-o' as string]: 0.45 }}>
        <div className="grid grid-cols-[1.5fr_.9fr_1fr] gap-6">
          <div>
            <p className="eyebrow mb-3">{group.label}</p>
            <ul className="grid grid-cols-2 gap-2">
              {group.items.map((it) => (
                <li key={it.section}>
                  <button type="button" onClick={() => onGo(it.section)}
                    className="bezel bezel-hover group flex w-full items-start gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-white/[.04]">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-crimson/10 text-crimson-glow">
                      <it.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block font-bold text-graphite">{it.label}</span>
                      <span className="mt-0.5 block text-sm leading-snug text-graphite/55">{it.desc}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-l border-white/[.07] pl-6">
            <p className="eyebrow mb-3 !text-graphite/45">Explora</p>
            <ul className="space-y-1 text-sm font-semibold">
              <li><button type="button" onClick={() => onGo('casos')} className="flex items-center gap-2 py-1.5 text-graphite/75 hover:text-graphite"><PlayCircle className="h-4 w-4" aria-hidden /> Casos / Videos</button></li>
              <li><Link to="/blog" className="flex items-center gap-2 py-1.5 text-graphite/75 hover:text-graphite"><BookOpen className="h-4 w-4" aria-hidden /> Blog</Link></li>
              <li><a href={COMMUNITY_URL} className="flex items-center gap-2 py-1.5 text-graphite/75 hover:text-graphite"><Users className="h-4 w-4" aria-hidden /> Comunidad</a></li>
              <li><button type="button" onClick={onTalk} className="flex items-center gap-2 py-1.5 text-graphite/75 hover:text-graphite"><MessageCircle className="h-4 w-4" aria-hidden /> Habla con Caro</button></li>
              <li className="pt-2"><button type="button" onClick={onRecruit} className="flex items-center gap-2 py-1.5 text-graphite/45 hover:text-graphite"><Briefcase className="h-4 w-4" aria-hidden /> Trabaja con Caro</button></li>
            </ul>
          </div>

          {group.id === 'blindaje' ? (
            <FeatureCard img={HERO_POSTER} imgPos="78% 50%" kicker="Diagnóstico gratis · 3 min" title="¿Qué tan blindado estás?"
              body="5 preguntas, sin datos de salud. Resultado al instante." cta="Haz tu diagnóstico" onClick={onDiag} />
          ) : (
            <FeatureCard img={FRAMES.liquidezFamilia} imgPos="50% 22%" kicker="Casos ilustrativos" title="Paola, Andrés y Camilo"
              body="Tres metas, un mismo blindaje. Mira cómo se arma cada plan." cta="Ver casos" onClick={() => onGo('casos')} />
          )}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ img, imgPos, kicker, title, body, cta, onClick }: {
  img: string; imgPos: string; kicker: string; title: string; body: string; cta: string; onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick}
      className="bezel group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-2xl p-5 text-left">
      <img src={img} alt="" aria-hidden loading="lazy" className="absolute inset-x-0 top-0 h-[58%] w-full object-cover opacity-75 transition-transform duration-700 group-hover:scale-105"
        style={{ objectPosition: imgPos }} />
      <span className="absolute inset-0 bg-gradient-to-t from-[#141414] from-45% via-[#141414]/80 via-60% to-transparent" aria-hidden />
      <span className="relative">
        <span className="eyebrow block">{kicker}</span>
        <span className="mt-1 block text-xl font-black tracking-tight">{title}</span>
        <span className="mt-1 block text-sm text-graphite/65">{body}</span>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-graphite">
          {cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </span>
    </button>
  );
}

function Drawer({ onClose, onGo, onDiag, onTalk, onRecruit }: { onClose: () => void } & Actions) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeRef.current?.focus(); }, []);
  const row = 'flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left text-lg font-semibold text-graphite/85 hover:bg-white/[.04] hover:text-graphite';
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-dark lg:hidden" role="dialog" aria-modal="true" aria-label="Menú">
      <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
        <Brand size="md" />
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Cerrar menú" className="-mr-2 rounded-full p-2 text-graphite/80 hover:text-graphite">
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="rainbow-line" aria-hidden />
      <div className="flex-1 overflow-y-auto px-4 pb-10 pt-6 sm:px-6">
        <button type="button" onClick={onDiag} className="btn-primary w-full">Haz tu diagnóstico gratis <ArrowRight className="h-5 w-5" /></button>
        <p className="mt-2 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-graphite/45">3 minutos · Sin costo · Resultado al instante</p>

        {GROUPS.map((g) => (
          <div key={g.id} className="mt-8">
            <p className="eyebrow mb-1 px-2">{g.label}</p>
            <ul>
              {g.items.map((it) => (
                <li key={it.section}>
                  <button type="button" onClick={() => onGo(it.section)} className={row}>
                    <it.icon className="h-5 w-5 shrink-0 text-crimson-glow" aria-hidden /> {it.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="rainbow-divider mt-8" aria-hidden />
        <ul className="mt-4">
          <li><button type="button" onClick={() => onGo('casos')} className={row}><PlayCircle className="h-5 w-5 shrink-0 text-graphite/50" aria-hidden /> Casos / Videos</button></li>
          <li><Link to="/blog" onClick={onClose} className={row}><BookOpen className="h-5 w-5 shrink-0 text-graphite/50" aria-hidden /> Blog</Link></li>
          <li><a href={COMMUNITY_URL} className={row}><Users className="h-5 w-5 shrink-0 text-graphite/50" aria-hidden /> Comunidad</a></li>
          <li><button type="button" onClick={onTalk} className={row}><MessageCircle className="h-5 w-5 shrink-0 text-graphite/50" aria-hidden /> Habla con Caro</button></li>
          <li><button type="button" onClick={onRecruit} className={`${row} !text-base !text-graphite/55`}><Briefcase className="h-5 w-5 shrink-0 text-graphite/40" aria-hidden /> Trabaja con Caro</button></li>
        </ul>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, X, MessageCircle, CalendarClock, Lock } from 'lucide-react';
import {
  loadProfile, saveProfile, saveAnswer, planQuestions,
  type Profile, type Question,
} from '../lib/profile';
import { computeResult, scoreLabel, formatCOP, RATE_CONSERVATIVE, RATE_MODERATE, YEARS, type ResultDetail } from '../lib/blindaje';
import { postLead, captureUtm, normalizeWhatsapp, isValidWhatsapp, caroWhatsappLink, bookingUrl, track } from '../lib/lead';
import { DISCLAIMER } from '../config';
import { useCountUp } from '../hooks/motion';

type Step = { kind: 'q'; q: Question } | { kind: 'contact' } | { kind: 'result' } | { kind: 'welcome' };

export default function Diagnostic({ variant, onClose }: { variant: 'modal' | 'page'; onClose?: () => void }) {
  const [profile, setProfile] = useState<Profile>(() => loadProfile());
  const plan = useMemo(() => planQuestions(loadProfile()), []); // frozen for this session
  const steps: Step[] = useMemo(() => {
    const qs: Step[] = plan.questions.map((q) => ({ kind: 'q', q }));
    if (plan.mode === 'return') {
      return qs.length ? [{ kind: 'welcome' }, ...qs, { kind: 'result' }] : [{ kind: 'result' }];
    }
    return [...qs, { kind: 'contact' }, { kind: 'result' }];
  }, [plan]);
  const [i, setI] = useState(0);
  const [sending, setSending] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);
  const step = steps[Math.min(i, steps.length - 1)];
  const total = steps.filter((s) => s.kind === 'q' || s.kind === 'contact').length;
  const done = steps.slice(0, i).filter((s) => s.kind === 'q' || s.kind === 'contact').length;

  useEffect(() => { track('InitiateCheckout', { content_name: 'diagnostico_blindaje' }); }, []);

  const answer = (key: string, value: string) => {
    setProfile(saveAnswer(key, value));
    setI((n) => n + 1);
  };

  // Return visitors: when they reach the result, push the new answers to the same lead.
  useEffect(() => {
    if (step.kind !== 'result' || plan.mode !== 'return' || !plan.questions.length) return;
    const p = loadProfile();
    if (!p.contact) return;
    const r = computeResult(p);
    p.result = { score: r.score, gap_cop: r.gap_cop, projection_cop: r.projection_cop };
    saveProfile(p);
    postLead({
      source: 'blindaje-diagnostico', nombre: p.contact.nombre, whatsapp: p.contact.whatsapp, email: p.contact.email,
      answers: p.answers, result: p.result, utm: captureUtm(),
      consent: { datos: true, mayor_edad: true, marketing: Boolean(p.marketing), ts: new Date().toISOString() },
    });
  }, [step.kind, plan]);

  async function submitContact(c: { nombre: string; whatsapp: string; email: string; marketing: boolean }) {
    setSending(true);
    const p = loadProfile();
    const r = computeResult(p);
    const result = { score: r.score, gap_cop: r.gap_cop, projection_cop: r.projection_cop };
    const contact = { nombre: c.nombre.trim(), whatsapp: normalizeWhatsapp(c.whatsapp), email: c.email.trim() };
    const ok = await postLead({
      source: 'blindaje-diagnostico', ...contact, answers: p.answers, result, utm: captureUtm(),
      consent: { datos: true, mayor_edad: true, marketing: c.marketing, ts: new Date().toISOString() },
    });
    const next: Profile = { ...p, contact, result, marketing: c.marketing, submitted_at: ok ? new Date().toISOString() : p.submitted_at };
    saveProfile(next);
    setProfile(next);
    setSendFailed(!ok);
    setSending(false);
    setI((n) => n + 1);
  }

  const frame = variant === 'modal'
    ? 'relative rounded-3xl border border-white/10 bg-dark-light p-5 shadow-[0_0_80px_-20px_rgba(230,0,0,.35)] sm:p-8'
    : 'relative rounded-3xl border border-white/10 bg-dark-light p-5 sm:p-8';

  return (
    <div className={frame}>
      <div className="mb-6 flex items-center gap-3">
        {i > 0 && step.kind !== 'result' ? (
          <button type="button" onClick={() => setI((n) => n - 1)} className="-ml-2 rounded-lg p-2 text-white/60 hover:text-white" aria-label="Atrás">
            <ChevronLeft className="h-6 w-6" />
          </button>
        ) : <span className="w-2" />}
        <div className="flex-1">
          <div className="flex justify-between gap-3 font-mono text-[11px] uppercase tracking-widest text-white/50">
            <span>Diagnóstico</span>
            {step.kind !== 'result' && total > 0 && <span>{Math.min(done + 1, total)} / {total}</span>}
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}>
            <div className="h-full rounded-full bg-crimson transition-[width] duration-500" style={{ width: `${step.kind === 'result' ? 100 : (done / Math.max(total, 1)) * 100}%` }} />
          </div>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="-mr-2 rounded-lg p-2 text-white/60 hover:text-white" aria-label="Cerrar">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      <div key={i} className="step-in">
        {step.kind === 'welcome' && (
          <div>
            <h2 className="text-3xl font-black tracking-tight">¡Hola de nuevo{profile.contact?.nombre ? `, ${profile.contact.nombre.split(' ')[0]}` : ''}!</h2>
            <p className="mt-3 text-lg text-white/70">Ya tienes tu diagnóstico. Responde {plan.questions.length} preguntas rápidas más y afinamos tu Mapa de Blindaje.</p>
            <div className="mt-8 flex flex-col gap-3">
              <button type="button" onClick={() => setI(1)} className="btn-primary">Afinar mi resultado <ArrowRight className="h-5 w-5" /></button>
              <button type="button" onClick={() => setI(steps.length - 1)} className="btn-ghost">Ver mi resultado</button>
            </div>
          </div>
        )}
        {step.kind === 'q' && <QuestionScreen q={step.q} value={profile.answers[step.q.key]} onAnswer={answer} />}
        {step.kind === 'contact' && <ContactScreen sending={sending} initial={profile.contact} onSubmit={submitContact} />}
        {step.kind === 'result' && <ResultScreen profile={profile} sendFailed={sendFailed} />}
      </div>
    </div>
  );
}

function QuestionScreen({ q, value, onAnswer }: { q: Question; value?: string; onAnswer: (k: string, v: string) => void }) {
  return (
    <fieldset>
      <legend className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">{q.q}</legend>
      {q.hint && <p className="mt-2 text-sm text-white/55">{q.hint}</p>}
      <div className="mt-6 grid gap-3">
        {q.options.map((o) => (
          <button key={o.value} type="button" onClick={() => onAnswer(q.key, o.value)}
            className={`min-h-[56px] rounded-2xl border px-5 py-4 text-left text-lg font-semibold transition-colors active:scale-[.99] ${
              value === o.value ? 'border-crimson bg-crimson/15' : 'border-white/15 bg-dark hover:border-crimson/70 hover:bg-crimson/10'}`}>
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function ContactScreen({ sending, initial, onSubmit }: {
  sending: boolean; initial?: { nombre: string; whatsapp: string; email: string };
  onSubmit: (c: { nombre: string; whatsapp: string; email: string; marketing: boolean }) => void;
}) {
  const [nombre, setNombre] = useState(initial?.nombre || '');
  const [whatsapp, setWhatsapp] = useState(initial?.whatsapp || '');
  const [email, setEmail] = useState(initial?.email || '');
  const [consent, setConsent] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [touched, setTouched] = useState(false);
  const waOk = isValidWhatsapp(whatsapp);
  const emailOk = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const valid = nombre.trim().length >= 2 && waOk && emailOk && consent;
  const input = 'w-full rounded-xl border border-white/15 bg-dark px-4 py-3.5 text-lg text-white placeholder-white/30 focus:border-crimson focus:outline-none';

  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); setTouched(true); if (valid && !sending) onSubmit({ nombre, whatsapp, email, marketing }); }}>
      <h2 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">¡Listo! ¿A quién le enviamos tu Mapa de Blindaje?</h2>
      <p className="mt-2 text-white/60">Tu resultado aparece en pantalla al instante, y Caro te envía el mapa completo por WhatsApp.</p>
      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-white/80">Nombre *</span>
          <input className={input} autoComplete="given-name" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" />
          {touched && nombre.trim().length < 2 && <span className="mt-1 block text-sm text-crimson-glow">Escribe tu nombre.</span>}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-white/80">WhatsApp *</span>
          <div className="flex">
            <span className="flex items-center rounded-l-xl border border-r-0 border-white/15 bg-dark-lighter px-3 font-mono text-white/60">+57</span>
            <input className={`${input} rounded-l-none`} type="tel" inputMode="tel" autoComplete="tel-national" value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)} placeholder="300 123 4567" />
          </div>
          {touched && !waOk && <span className="mt-1 block text-sm text-crimson-glow">Revisa tu número de WhatsApp (10 dígitos).</span>}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-white/80">Correo <span className="font-normal text-white/45">(opcional)</span></span>
          <input className={input} type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" />
          {touched && !emailOk && <span className="mt-1 block text-sm text-crimson-glow">Revisa tu correo.</span>}
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-dark p-3">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#e60000]" />
          <span className="text-sm leading-relaxed text-white/75">
            Soy mayor de 18 años y autorizo el tratamiento de mis datos personales (Ley 1581) según la{' '}
            <Link to="/privacidad" target="_blank" className="font-semibold text-white underline">política de privacidad</Link>. *
          </span>
        </label>
        {touched && !consent && <span className="-mt-2 block text-sm text-crimson-glow">Necesitamos tu autorización para enviarte el resultado.</span>}
        <label className="flex cursor-pointer items-start gap-3 px-3">
          <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#e60000]" />
          <span className="text-sm leading-relaxed text-white/60">Quiero recibir contenidos y novedades de Mindset Caro por WhatsApp o correo (opcional).</span>
        </label>
      </div>
      <button type="submit" disabled={sending} className="btn-primary mt-6 w-full disabled:opacity-60">
        {sending ? 'Calculando…' : <>Ver mi resultado <ArrowRight className="h-5 w-5" /></>}
      </button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-white/45"><Lock className="h-3.5 w-3.5" /> Sin spam. Nunca pedimos datos de salud aquí.</p>
    </form>
  );
}

function ResultScreen({ profile, sendFailed }: { profile: Profile; sendFailed: boolean }) {
  const r: ResultDetail = useMemo(() => computeResult(profile), [profile]);
  const s = useCountUp(r.score, true, 1400);
  const label = scoreLabel(r.score);
  const first = profile.contact?.nombre?.split(' ')[0];
  const META_PHRASE: Record<string, string> = {
    'Mi familia': 'proteger a tu familia',
    'Mi jubilación': 'tu jubilación',
    'Educación': 'la educación de tus hijos',
    'Invertir / hacer crecer mi dinero': 'hacer crecer tu dinero',
  };
  const meta = META_PHRASE[profile.answers.meta_blindaje ?? ''] ?? 'tu meta';
  const wa = caroWhatsappLink(`Hola Caro, soy ${profile.contact?.nombre || ''}. Hice el diagnóstico de Blindaje Patrimonial (puntaje ${r.score}/100) y quiero mi Mapa de Blindaje.`);
  const waCall = caroWhatsappLink(`Hola Caro, soy ${profile.contact?.nombre || ''}. Quiero agendar la llamada gratis de 20 minutos.`);
  const booking = bookingUrl() || waCall;
  const C = 2 * Math.PI * 52;

  return (
    <div>
      <p className="eyebrow">{first ? `${first}, este es tu resultado` : 'Tu resultado'}</p>
      <div className="mt-4 flex items-center gap-5">
        <svg viewBox="0 0 120 120" className="h-32 w-32 shrink-0 -rotate-90" aria-hidden>
          <circle cx="60" cy="60" r="52" fill="none" stroke="#ffffff" strokeOpacity=".1" strokeWidth="12" />
          <circle cx="60" cy="60" r="52" fill="none" stroke="#e60000" strokeWidth="12" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - s / 100)} />
        </svg>
        <div>
          <p className="num font-mono text-5xl font-bold"><span className={s >= r.score ? 'land inline-block' : ''}>{Math.round(s)}</span><span className="text-xl text-white/50">/100</span></p>
          <p className="mt-1 text-xl font-black">{label.title}</p>
        </div>
      </div>
      <p className="mt-4 text-white/75">{label.body}</p>

      <div className="mt-6 grid gap-3">
        <div className="rounded-2xl border border-crimson/40 bg-crimson/10 p-5">
          <p className="font-mono text-[11px] uppercase tracking-widest text-white/60">Brecha de protección estimada</p>
          <p className="num mt-1 text-3xl font-black">{formatCOP(r.gap_cop)}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/65">
            Lo que le faltaría a tu familia para sostener unos {r.years_support} {r.years_support === 1 ? 'año' : 'años'} de ingresos
            {r.income_is_estimate ? ' (ingreso estimado a partir de tu capacidad de ahorro)' : ''}
            {r.covered_cop ? ', descontando una cobertura típica para el seguro que ya tienes' : ''}.
          </p>
        </div>
        <div className="rounded-2xl border border-white/15 bg-dark p-5">
          <p className="font-mono text-[11px] uppercase tracking-widest text-white/60">Tu ahorro a {YEARS} años · ilustrativo</p>
          <p className="num mt-1 text-3xl font-black">{formatCOP(r.projection_low)} – {formatCOP(r.projection_cop)}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/65">
            Si apartas cerca de {formatCOP(r.monthly)} al mes para {meta}: aportarías {formatCOP(r.contributed)} en {YEARS} años. El rango usa
            rendimientos hipotéticos de {Math.round(RATE_CONSERVATIVE * 100)} % y {Math.round(RATE_MODERATE * 100)} % anual sobre el ahorro invertido en un índice S&amp;P 500.
            No es una promesa: el mercado sube y baja, y el plan real descuenta el costo de la protección.
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-white/45">
        Supuestos ilustrativos basados en rangos, no es una cotización ni asesoría personalizada. {DISCLAIMER}
      </p>
      {sendFailed && (
        <p className="mt-3 rounded-xl border border-white/15 p-3 text-sm text-white/70">No pudimos enviar tus datos a Caro en este momento. Escríbele directamente y te ayuda.</p>
      )}

      <div className="mt-6 grid gap-3">
        {wa ? (
          <a href={wa} target="_blank" rel="noopener" className="btn-primary"><MessageCircle className="h-5 w-5" /> Recibe tu Mapa por WhatsApp</a>
        ) : (
          <p className="rounded-xl bg-crimson/15 p-4 text-center font-semibold">Caro te escribirá por WhatsApp con tu Mapa de Blindaje.</p>
        )}
        {booking && (
          <a href={booking} target="_blank" rel="noopener" className="btn-ghost"><CalendarClock className="h-5 w-5" /> Agenda tu llamada gratis de 20 min</a>
        )}
      </div>
    </div>
  );
}

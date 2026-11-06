import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Send } from 'lucide-react';
import {
  GREETING, FAQ, FAQ_CHIPS, FALLBACK, replyTo, classify, type Chip, type Intent,
} from '../lib/botBrain';
import { loadProfile, saveAnswer, saveProfile, nextUnanswered, visit1Done, VISIT1, LATER, type Question } from '../lib/profile';
import { computeResult } from '../lib/blindaje';
import { postLead, captureUtm, normalizeWhatsapp, isValidWhatsapp, caroWhatsappLink } from '../lib/lead';
import { useUi, type BotIntent } from '../ui';

type Msg = { from: 'bot' | 'user'; text: string; chips?: Chip[]; privacyLink?: boolean };
type Mode = 'chat' | 'ask_name' | 'ask_whatsapp' | 'ask_consent' | 'done';

const LADDER_INTROS = ['Por cierto, ', 'Una pregunta rápida: ', 'Y cuéntame, '];
const lowerFirst = (s: string) => (s.startsWith('¿') ? '¿' + s.charAt(1).toLowerCase() + s.slice(2) : s.charAt(0).toLowerCase() + s.slice(1));

export default function CaroBot({ open, intent, onClose }: { open: boolean; intent: BotIntent; onClose: () => void }) {
  const { openDiagnostic } = useUi();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [mode, setMode] = useState<Mode>('chat');
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const draft = useRef<{ nombre: string; whatsapp: string; extra: Record<string, string> }>({ nombre: '', whatsapp: '', extra: {} });
  const ladderAnswered = useRef(0);
  const faqCount = useRef(0);
  const started = useRef<BotIntent | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const bot = (m: Omit<Msg, 'from'>, delay = 450) => {
    setTyping(true);
    window.setTimeout(() => { setTyping(false); setMsgs((x) => [...x, { from: 'bot', ...m }]); }, delay);
  };
  const user = (text: string) => setMsgs((x) => [...x, { from: 'user', text }]);

  // Opening line depends on where the visitor clicked from.
  useEffect(() => {
    if (!open || started.current === intent) return;
    const first = started.current === null;
    started.current = intent;
    if (intent === 'recruit') { if (first) setMsgs([]); startRecruit(); return; }
    if (intent === 'talk') { if (first) setMsgs([]); startTalk(); return; }
    if (first) setMsgs([{ from: 'bot', text: GREETING, chips: [...FAQ_CHIPS, { label: 'Hacer mi diagnóstico', action: 'diag' }] }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, intent]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [msgs, typing]);
  useEffect(() => { if (open && mode !== 'chat' && mode !== 'done') inputRef.current?.focus(); }, [mode, open]);

  function startRecruit() {
    draft.current.extra = { interes_trabajar_con_caro: 'Sí' };
    bot({ text: '¡Qué bueno que te interese! Caro está formando un equipo de asesores en Colombia y te enseña su método. Para contarte cómo funciona, ¿cómo te llamas?' }, 300);
    setMode('ask_name');
  }

  function startTalk() {
    const wa = caroWhatsappLink('Hola Caro, quiero saber más sobre el Blindaje Patrimonial.');
    if (wa) {
      bot({ text: 'Claro. Puedes escribirle directo a Caro por WhatsApp:', chips: [{ label: 'Abrir WhatsApp', action: `link:${wa}` }, ...FAQ_CHIPS.slice(0, 2)] }, 300);
      return;
    }
    const p = loadProfile();
    if (p.contact?.whatsapp) {
      bot({ text: `Listo${p.contact.nombre ? `, ${p.contact.nombre.split(' ')[0]}` : ''}: Caro ya tiene tu WhatsApp y te escribirá pronto. Mientras tanto, ¿te resuelvo alguna duda?`, chips: FAQ_CHIPS }, 300);
      return;
    }
    bot({ text: 'Con gusto. Caro te escribe por WhatsApp personalmente. ¿Cómo te llamas?' }, 300);
    setMode('ask_name');
  }

  function nextLadderQuestion(): Question | undefined {
    const p = loadProfile();
    return nextUnanswered(p, visit1Done(p) ? LATER : VISIT1);
  }

  function askLadder() {
    const q = nextLadderQuestion();
    if (!q || ladderAnswered.current >= 3) return offerNext();
    const intro = LADDER_INTROS[ladderAnswered.current % LADDER_INTROS.length];
    bot({ text: intro + lowerFirst(q.q), chips: q.options.map((o) => ({ label: o.label, action: `ans:${q.key}:${o.value}` })) }, 700);
  }

  function offerNext() {
    const p = loadProfile();
    const chips: Chip[] = [{ label: 'Hacer mi diagnóstico (3 min)', action: 'diag' }];
    const wa = caroWhatsappLink('Hola Caro, vengo de tu página y quiero mi Mapa de Blindaje.');
    if (wa) chips.push({ label: 'Escribirle a Caro', action: `link:${wa}` });
    else if (!p.contact?.whatsapp) chips.push({ label: 'Que Caro me escriba', action: 'contact' });
    bot({ text: 'Con lo que me contaste, el diagnóstico te muestra tu puntaje de blindaje y una proyección ilustrativa de tu ahorro. ¿Qué prefieres?', chips: [...chips, ...FAQ_CHIPS.slice(0, 3)] }, 700);
  }

  function handleIntent(intent: Intent, text: string) {
    if (intent.kind === 'faq') {
      faqCount.current += 1;
      bot({ text: FAQ[intent.key].a });
      askLadder();
      return;
    }
    if (intent.kind === 'recruit') return startRecruit();
    if (intent.kind === 'talk') return startTalk();
    if (intent.kind === 'diag') { bot({ text: '¡Vamos! Te abro el diagnóstico.' }, 300); window.setTimeout(() => { onClose(); openDiagnostic(); }, 900); return; }
    void text;
    bot({ text: FALLBACK, chips: [{ label: 'Hacer mi diagnóstico', action: 'diag' }, { label: 'Que Caro me escriba', action: 'talk' }, ...FAQ_CHIPS.slice(0, 3)] });
  }

  async function onChip(c: Chip) {
    const [kind, ...rest] = c.action.split(':');
    if (kind === 'link') { window.open(rest.join(':'), '_blank', 'noopener'); return; }
    user(c.label);
    if (kind === 'faq') return handleIntent({ kind: 'faq', key: rest[0] }, c.label);
    if (kind === 'diag') return handleIntent({ kind: 'diag' }, c.label);
    if (kind === 'talk' || kind === 'contact') { bot({ text: 'Perfecto. ¿Cómo te llamas?' }); setMode('ask_name'); return; }
    if (kind === 'ans') {
      const [key, ...v] = rest;
      saveAnswer(key, v.join(':'));
      ladderAnswered.current += 1;
      bot({ text: ['Anotado.', 'Gracias, me sirve mucho.', 'Perfecto.'][ladderAnswered.current % 3] }, 350);
      if (ladderAnswered.current >= 2) offerNext(); else askLadder();
      return;
    }
    if (kind === 'consent') {
      if (rest[0] === 'yes') return submitLead();
      bot({ text: 'Entendido, no guardo tus datos. Si cambias de opinión, aquí estoy.', chips: FAQ_CHIPS.slice(0, 3) });
      setMode('chat');
    }
  }

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput('');
    user(text);
    if (mode === 'ask_name') {
      if (classify(text).kind === 'faq' && text.length > 25) { setMode('chat'); return handleIntent(classify(text), text); }
      draft.current.nombre = text.slice(0, 80);
      bot({ text: `Mucho gusto, ${text.split(' ')[0]}. ¿Cuál es tu WhatsApp? (10 dígitos, ej. 300 123 4567)` });
      setMode('ask_whatsapp');
      return;
    }
    if (mode === 'ask_whatsapp') {
      if (!isValidWhatsapp(text)) { bot({ text: 'Mmm, ese número no me cuadra. Escríbelo con 10 dígitos, por ejemplo 300 123 4567.' }); return; }
      draft.current.whatsapp = normalizeWhatsapp(text);
      bot({ text: 'Último paso: para que Caro te contacte necesito tu autorización.', privacyLink: true,
        chips: [{ label: 'Soy mayor de 18 y autorizo', action: 'consent:yes' }, { label: 'No, gracias', action: 'consent:no' }] });
      setMode('ask_consent');
      return;
    }
    setTyping(true);
    const { reply, intent } = await replyTo(text, { profile: loadProfile(), history: msgs.map(({ from, text }) => ({ from, text })) });
    setTyping(false);
    if (reply && intent.kind !== 'faq') { bot({ ...reply }, 200); return; }
    if (reply && intent.kind === 'faq') { faqCount.current += 1; bot({ ...reply }, 200); askLadder(); return; }
    handleIntent(intent, text);
  }

  async function submitLead() {
    setMode('done');
    const p = loadProfile();
    if (Object.keys(draft.current.extra).length) {
      for (const [k, v] of Object.entries(draft.current.extra)) p.answers[k] = v;
    }
    const contact = { nombre: draft.current.nombre, whatsapp: draft.current.whatsapp, email: p.contact?.email || '' };
    const r = visit1Done(p) ? computeResult(p) : null;
    const ok = await postLead({
      source: 'bot', ...contact, answers: p.answers,
      result: r ? { score: r.score, gap_cop: r.gap_cop, projection_cop: r.projection_cop } : null,
      utm: captureUtm(),
      consent: { datos: true, mayor_edad: true, marketing: false, ts: new Date().toISOString() },
    });
    saveProfile({ ...p, contact: { ...contact } });
    bot({
      text: ok
        ? `¡Listo, ${contact.nombre.split(' ')[0]}! Caro te escribirá por WhatsApp. Mientras tanto, puedes hacer tu diagnóstico gratis.`
        : 'Uy, no pude enviar tus datos en este momento. Inténtalo de nuevo en un rato o haz el diagnóstico.',
      chips: [{ label: 'Hacer mi diagnóstico', action: 'diag' }, ...FAQ_CHIPS.slice(0, 2)],
    });
    setMode('chat');
  }

  if (!open) return null;
  const placeholder = mode === 'ask_name' ? 'Tu nombre' : mode === 'ask_whatsapp' ? 'Tu WhatsApp' : 'Escribe tu pregunta…';

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-dark-light shadow-2xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[600px] sm:w-[390px] sm:rounded-3xl"
      role="dialog" aria-label="Caro IA">
      <header className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-crimson-deep to-dark-light px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-crimson font-black">C</div>
        <div className="flex-1">
          <p className="font-extrabold leading-tight">Caro IA</p>
          <p className="text-xs text-white/60">Asistente virtual automática de Carolina</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-lg p-2 text-white/70 hover:text-white" aria-label="Cerrar chat"><X className="h-5 w-5" /></button>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
        {msgs.map((m, k) => (
          <div key={k} className={m.from === 'user' ? 'flex justify-end' : ''}>
            <div className={`max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
              m.from === 'user' ? 'rounded-br-md bg-crimson text-white' : 'rounded-bl-md bg-dark text-white/90'}`}>
              {m.text}
              {m.privacyLink && (
                <span className="mt-2 block text-xs text-white/60">
                  Soy mayor de 18 años y autorizo el tratamiento de mis datos personales (Ley 1581) según la{' '}
                  <Link to="/privacidad" target="_blank" className="underline">política de privacidad</Link>.
                </span>
              )}
            </div>
            {m.chips && k === msgs.length - 1 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {m.chips.map((c) => (
                  <button key={c.action + c.label} type="button" onClick={() => onChip(c)}
                    className="min-h-[40px] rounded-full border border-crimson/50 px-3.5 py-2 text-left text-sm font-semibold text-white hover:bg-crimson/20">
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {typing && <div className="w-16 rounded-2xl bg-dark px-4 py-3 text-center tracking-[0.3em] text-white/60">···</div>}
        <div ref={endRef} />
      </div>

      <form onSubmit={onSend} className="flex gap-2 border-t border-white/10 p-3">
        <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder={placeholder}
          type={mode === 'ask_whatsapp' ? 'tel' : 'text'} inputMode={mode === 'ask_whatsapp' ? 'tel' : 'text'}
          disabled={mode === 'ask_consent' || mode === 'done'}
          className="min-w-0 flex-1 rounded-xl border border-white/15 bg-dark px-4 py-3 text-base text-white placeholder-white/35 focus:border-crimson focus:outline-none disabled:opacity-50" />
        <button type="submit" className="rounded-xl bg-crimson px-4 text-white hover:bg-crimson-glow" aria-label="Enviar"><Send className="h-5 w-5" /></button>
      </form>
      <p className="px-4 pb-3 text-[11px] leading-snug text-white/40">Respuestas informativas, no son asesoría personalizada ni prometen rentabilidades.</p>
    </div>
  );
}

// Lead capture + attribution + contact helpers.
import { BOOKING_URL, CARO_WHATSAPP, LEAD_ENDPOINT } from '../config';
import type { Result } from './profile';

export type Utm = { source: string; medium: string; campaign: string; content: string; fbclid: string };
const UTM_KEY = 'mc_utm_v1';

/** First-touch attribution: keep the ad that first brought the visitor, refresh only when a
 *  new tagged URL arrives (e.g. they click a second ad). */
export function captureUtm(): Utm {
  const empty: Utm = { source: '', medium: '', campaign: '', content: '', fbclid: '' };
  let stored: Utm = empty;
  try { stored = { ...empty, ...JSON.parse(localStorage.getItem(UTM_KEY) || '{}') }; } catch { /* ignore */ }
  try {
    const q = new URLSearchParams(window.location.search);
    const fresh: Utm = {
      source: q.get('utm_source') || '',
      medium: q.get('utm_medium') || '',
      campaign: q.get('utm_campaign') || '',
      content: q.get('utm_content') || '',
      fbclid: q.get('fbclid') || '',
    };
    if (Object.values(fresh).some(Boolean)) {
      stored = fresh;
      try { localStorage.setItem(UTM_KEY, JSON.stringify(fresh)); } catch { /* ignore */ }
    }
  } catch { /* ignore */ }
  return stored;
}

export type LeadPayload = {
  source: 'blindaje-diagnostico' | 'bot';
  nombre: string;
  whatsapp: string;
  email: string;
  answers: Record<string, string>;
  result: Result | null;
  utm: Utm;
  // CUBO drops the lead unless BOTH datos and mayor_edad are true (evidence, not a flag).
  consent: { datos: true; mayor_edad: true; marketing: boolean; ts: string };
};

export async function postLead(p: LeadPayload): Promise<boolean> {
  try {
    const r = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p),
    });
    track('Lead', { source: p.source });
    return r.ok;
  } catch {
    return false;
  }
}

/** Fire an analytics event if a pixel / gtag is ever installed on the page. No-op otherwise. */
export function track(event: string, params: Record<string, unknown> = {}) {
  try {
    const w = window as unknown as { fbq?: (...a: unknown[]) => void; gtag?: (...a: unknown[]) => void };
    w.fbq?.('track', event, params);
    w.gtag?.('event', event, params);
  } catch { /* ignore */ }
}

/** Colombian mobile → +57XXXXXXXXXX. Keeps other international numbers as typed. */
export function normalizeWhatsapp(raw: string): string {
  const d = raw.replace(/\D/g, '');
  if (d.length === 10 && d.startsWith('3')) return `+57${d}`;
  if (d.length === 12 && d.startsWith('57')) return `+${d}`;
  return d ? `+${d}` : '';
}

export function isValidWhatsapp(raw: string) {
  const d = raw.replace(/\D/g, '');
  return (d.length === 10 && d.startsWith('3')) || (d.length >= 11 && d.length <= 15);
}

let runtimeWhatsapp = CARO_WHATSAPP;
let runtimeBooking = BOOKING_URL;
export function setContactOverrides(o: { whatsapp?: string; booking?: string }) {
  if (o.whatsapp) runtimeWhatsapp = o.whatsapp.replace(/\D/g, '');
  if (o.booking) runtimeBooking = o.booking;
}
export const hasWhatsapp = () => Boolean(runtimeWhatsapp);
export const bookingUrl = () => runtimeBooking;

/** wa.me link to Caro with a prefilled message, or null if her number isn't configured. */
export function caroWhatsappLink(text: string): string | null {
  if (!runtimeWhatsapp) return null;
  return `https://wa.me/${runtimeWhatsapp}?text=${encodeURIComponent(text)}`;
}

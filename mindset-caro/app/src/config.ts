// Site-wide settings for mindsetcaro.com.
// Anything here can be overridden at runtime from the CMS (/api/mc-content?site=landing)
// with the keys noted next to each value — see useCms().

/** Carolina's WhatsApp in international digits, e.g. "573001234567".
 *  Build-time: VITE_CARO_WHATSAPP. Runtime: CMS key `contact.whatsapp`.
 *  Empty = no number on file yet → every "Habla con Caro" button falls back to the
 *  diagnostic / bot instead of opening a broken wa.me link. */
export const CARO_WHATSAPP: string = (import.meta.env.VITE_CARO_WHATSAPP as string | undefined) || '';

/** Booking link for the free 20-min call (Calendly, Zoho Bookings…). CMS: `contact.booking_url`.
 *  Empty = the "Agenda tu llamada" button asks for the call over WhatsApp instead. */
export const BOOKING_URL: string = (import.meta.env.VITE_CARO_BOOKING_URL as string | undefined) || '';

/** Vertical videos (9:16) for the "Caro te lo explica" slot. CMS: `blindaje.videos`
 *  (JSON array of {src, poster?, title}). Empty = the section is not rendered. */
export type VideoItem = { src: string; poster?: string; title: string };
export const VIDEOS: VideoItem[] = [];

/** Her portrait for the hero. CMS: `blindaje.hero.photo`. Empty = typographic hero with the
 *  animated shield (also the fastest LCP). */
export const HERO_PHOTO = '';

export const SITE_URL = 'https://www.mindsetcaro.com';

export const DISCLAIMER =
  'Las rentabilidades pasadas no garantizan rentabilidades futuras. Proyecciones ilustrativas. ' +
  'Producto sujeto a las condiciones de la póliza y a aprobación de la aseguradora.';

export const LEAD_ENDPOINT = '/api/lead';

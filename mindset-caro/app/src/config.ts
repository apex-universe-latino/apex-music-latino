// Site-wide settings for mindsetcaro.com.
// Anything here can be overridden at runtime from the CMS (/api/mc-content?site=landing)
// with the keys noted next to each value — see useCms(). The CMS is optional: the site
// renders fully from these defaults when it is unreachable.

/** Path to a file in app/public (served under the Vite base, /mindset-caro/). Every image
 *  lives in the repo so it can never vanish with an external project again. */
export const media = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`;

/** Carolina's WhatsApp in international digits, e.g. "573001234567".
 *  Build-time: VITE_CARO_WHATSAPP. Runtime: CMS key `contact.whatsapp`.
 *  Empty = no number on file yet → every "Habla con Caro" button falls back to the
 *  diagnostic / bot instead of opening a broken wa.me link. */
export const CARO_WHATSAPP: string = (import.meta.env.VITE_CARO_WHATSAPP as string | undefined) || '';

/** Booking link for the free 20-min call (Calendly, Zoho Bookings…). CMS: `contact.booking_url`.
 *  Empty = the "Agenda tu llamada" button asks for the call over WhatsApp instead. */
export const BOOKING_URL: string = (import.meta.env.VITE_CARO_BOOKING_URL as string | undefined) || '';

/** Her CUBO FRM community page (sign-up to her community). */
export const COMMUNITY_URL = 'https://frm.apexmodeloslatino.com/mindset-caro';

/** Vertical videos (9:16) for the "Caro te lo explica" slot. CMS: `blindaje.videos`
 *  (JSON array of {src, poster?, title}). Empty = the section is not rendered. */
export type VideoItem = { src: string; poster?: string; title: string };
export const VIDEOS: VideoItem[] = [];

/** ── PHOTO SLOT ─────────────────────────────────────────────────────────────────────
 *  Carolina's REAL portrait for the hero (never stock, never an AI-made person).
 *  To fill it: save the approved photo as app/public/media/caro/hero.webp (portrait,
 *  ~1080×1350, < 250 KB) and set HERO_PHOTO = media('media/caro/hero.webp'), or set the
 *  CMS key `blindaje.hero.photo` to an image URL. Empty = the hero shows the shield loop
 *  from her Blindaje video (non-person imagery). */
export const HERO_PHOTO = '';
export const HERO_LOOP = media('media/hero-loop.mp4');
export const HERO_POSTER = media('media/frames/escudo.webp');

/** Stills from her rendered Blindaje / Liquidez videos (non-person imagery). */
export const FRAMES = {
  dosMotores: media('media/frames/dos-motores.webp'),
  plan10: media('media/frames/plan-10-anos.webp'),
  destino: media('media/frames/destino.webp'),
  cierre: media('media/frames/cierre.webp'),
  liquidezActivos: media('media/frames/liquidez-activos.webp'),
  liquidezFamilia: media('media/frames/liquidez-familia.webp'),
};

/** "Casos" — one upcoming commercial per persona. All ILLUSTRATIVE characters, not clients.
 *  To publish a video: drop it at app/public/media/casos/<id>.mp4 (9:16, H.264, faststart)
 *  and set `src: media('media/casos/<id>.mp4')`, or set CMS key `blindaje.casos` (JSON array
 *  of {id, src}). Empty `src` = poster + "Video próximamente". */
export type Caso = {
  id: string; name: string; age: number; who: string; need: string; goals: string[]; poster: string; src: string;
};
export const CASOS: Caso[] = [
  {
    id: 'paola', name: 'Paola', age: 38, who: 'Empleada · mamá de dos',
    need: 'Quiere que su familia quede protegida si algo le pasa y asegurar la universidad de sus hijos.',
    goals: ['Protección familiar', 'Educación de los hijos'], poster: FRAMES.liquidezFamilia, src: '',
  },
  {
    id: 'andres', name: 'Andrés', age: 45, who: 'Independiente · tiene su propio negocio',
    need: 'No cotiza a pensión. Busca construir su jubilación y que su familia tenga liquidez si algo pasa.',
    goals: ['Jubilación', 'Liquidez'], poster: FRAMES.plan10, src: '',
  },
  {
    id: 'camilo', name: 'Camilo', age: 32, who: 'Profesional',
    need: 'Quiere ahorrar en dólares y tener exposición a las empresas del S&P 500, con disciplina de largo plazo.',
    goals: ['Invertir en dólares', 'S&P 500'], poster: FRAMES.dosMotores, src: '',
  },
];

export const SITE_URL = 'https://www.mindsetcaro.com';

export const BIO = 'Conoce cómo funcionan los seguros de vida con ahorro e inversión a largo plazo, en Colombia o en dólares.';

export const DISCLAIMER =
  'Las rentabilidades pasadas no garantizan rentabilidades futuras. Proyecciones ilustrativas. ' +
  'Producto sujeto a las condiciones de la póliza y a aprobación de la aseguradora.';

export const LEAD_ENDPOINT = '/api/lead';

/** Hosts whose assets must never be used again (retired Apex Music project, DNS gone). */
export const RETIRED_ASSET_RE = /iaycaynevtumrqoknemk/i;

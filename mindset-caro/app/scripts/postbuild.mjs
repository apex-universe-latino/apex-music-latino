// After `vite build`:
//  1. Publish the CMS editor (mindset-caro/admin/index.html) at /mindset-caro/admin/ so the
//     vercel.json /cms rewrite actually resolves (before, the file was never in /public and
//     /cms silently served the landing page).
//  2. Write index.html into each SPA route folder (own canonical/title) so deep links also work on hosts without the
//     mindsetcaro.com catch-all rewrite (apexmusiclatino.com/mindset-caro/…, Vercel previews).
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '../../../public/mindset-caro');
const admin = join(here, '../../admin/index.html');

if (existsSync(admin)) {
  mkdirSync(join(out, 'admin'), { recursive: true });
  copyFileSync(admin, join(out, 'admin/index.html'));
}
// Each route shell gets its own canonical / og:url (always the www host) and title, so the raw
// HTML is right before React mounts. /blog and /blog/<slug> on mindsetcaro.com are rendered by
// api/data.js (action=blogpage); this shell only serves other hosts.
const SITE = 'https://www.mindsetcaro.com';
const ROUTES = {
  diagnostico: { title: 'Diagnóstico gratis de Blindaje Patrimonial | Mindset Caro',
    description: '¿Qué tan blindado estás? Responde 5 preguntas en 3 minutos y ve tu resultado: puntaje, brecha de protección y una proyección ilustrativa a 10 años.' },
  privacidad: { title: 'Política de tratamiento de datos | Mindset Caro',
    description: 'Cómo Mindset Caro trata tus datos personales conforme a la Ley 1581 de 2012.' },
  blog: { title: 'Blog | Mindset Caro — Seguros de vida, ahorro e inversión en Colombia',
    description: 'Artículos de Mindset Caro sobre blindaje patrimonial, seguros de vida con ahorro, el índice S&amp;P 500, liquidez para la familia y ahorro de largo plazo en Colombia.' },
};
const shell = readFileSync(join(out, 'index.html'), 'utf8');
for (const [route, meta] of Object.entries(ROUTES)) {
  const url = `${SITE}/${route}`;
  const html = shell
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${meta.title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, (_, p) => p + meta.description)
    .replace(/(<link rel="canonical" href=")[^"]*/, (_, p) => p + url)
    .replace(/(<meta property="og:url" content=")[^"]*/, (_, p) => p + url)
    .replace(/(<meta property="og:title" content=")[^"]*/, (_, p) => p + meta.title)
    .replace(/(<meta property="og:description" content=")[^"]*/, (_, p) => p + meta.description);
  mkdirSync(join(out, route), { recursive: true });
  writeFileSync(join(out, route, 'index.html'), html);
}
console.log('postbuild: admin + route shells written to', out);

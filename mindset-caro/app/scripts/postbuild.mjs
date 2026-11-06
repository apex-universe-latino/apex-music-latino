// After `vite build`:
//  1. Publish the CMS editor (mindset-caro/admin/index.html) at /mindset-caro/admin/ so the
//     vercel.json /cms rewrite actually resolves (before, the file was never in /public and
//     /cms silently served the landing page).
//  2. Copy index.html into each SPA route folder so deep links also work on hosts without the
//     mindsetcaro.com catch-all rewrite (apexmusiclatino.com/mindset-caro/…, Vercel previews).
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '../../../public/mindset-caro');
const admin = join(here, '../../admin/index.html');

if (existsSync(admin)) {
  mkdirSync(join(out, 'admin'), { recursive: true });
  copyFileSync(admin, join(out, 'admin/index.html'));
}
for (const route of ['diagnostico', 'privacidad', 'blog']) {
  mkdirSync(join(out, route), { recursive: true });
  copyFileSync(join(out, 'index.html'), join(out, route, 'index.html'));
}
console.log('postbuild: admin + route shells written to', out);

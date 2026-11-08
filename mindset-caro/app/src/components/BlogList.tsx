// BlogList.tsx — blog index (Mindset Caro).
// Published posts come from GET /api/posts (CUBO FRM prod, table mc_posts). On
// www.mindsetcaro.com the server also pre-renders this page's head + list (api/data.js
// action=blogpage); this component takes over once React mounts.

import { useEffect, useState } from 'react';
import { RETIRED_ASSET_RE } from '../config';
import { SEOHead } from './SEOHead';

type Post = {
  slug: string; title: string; excerpt?: string; cover_url?: string; cover_alt?: string;
  author?: string; tags?: string[]; published_at?: string;
};

const fmt = (d?: string) => (d ? new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' }) : '');

export default function BlogList({ apiBase = '', basePath = '/blog' }: { apiBase?: string; basePath?: string }) {
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    fetch(`${apiBase}/api/posts`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setPosts(Array.isArray(d) ? d : []))
      .catch(() => setPosts([]));
  }, [apiBase]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 text-white sm:px-6 sm:py-20">
      <SEOHead
        title="Blog | Mindset Caro — Seguros de vida, ahorro e inversión en Colombia"
        rawTitle
        description="Artículos de Mindset Caro sobre blindaje patrimonial, seguros de vida con ahorro, el índice S&P 500, liquidez para la familia y ahorro de largo plazo en Colombia."
        canonicalUrl="https://www.mindsetcaro.com/blog"
      />
      <p className="eyebrow">Blog</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Aprende conmigo</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/65">
        Seguros, ahorro e inversión de largo plazo explicados sin rodeos, para que tomes decisiones con calma.
      </p>

      {posts === null && <p className="mt-10 text-white/50">Cargando…</p>}
      {posts && posts.length === 0 && <p className="mt-10 text-white/50">Pronto publicaremos contenido nuevo.</p>}

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts?.map((p) => {
          const cover = p.cover_url && !RETIRED_ASSET_RE.test(p.cover_url) ? p.cover_url : null;
          return (
            <a key={p.slug} href={`${basePath}/${p.slug}`}
               className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-dark-lighter transition hover:-translate-y-0.5 hover:border-crimson/60">
              <div className="aspect-[16/9] bg-dark-light">
                {cover && <img src={cover} alt={p.cover_alt || ''} loading="lazy" className="h-full w-full object-cover" />}
              </div>
              <div className="flex flex-1 flex-col p-5">
                {!!p.tags?.length && <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-crimson-glow">{p.tags[0]}</div>}
                <h2 className="mt-2 text-lg font-extrabold leading-snug tracking-tight group-hover:text-crimson-glow">{p.title}</h2>
                {p.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/60">{p.excerpt}</p>}
                <div className="mt-auto pt-4 font-mono text-[11px] text-white/40">
                  {p.author || 'Mindset Caro'}{p.published_at ? ` · ${fmt(p.published_at)}` : ''}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

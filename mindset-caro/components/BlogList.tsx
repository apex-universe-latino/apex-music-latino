// BlogList.tsx — blog index (Mindset Caro). Standalone Tailwind drop-in.
//   <BlogList apiBase="" basePath="/blog" />
// Fetches published posts from GET /api/posts. Link to /blog/{slug}.

import React, { useEffect, useState } from 'react';

type Post = {
  slug: string; title: string; excerpt?: string; cover_url?: string;
  author?: string; tags?: string[]; published_at?: string;
};

export default function BlogList({ apiBase = '', basePath = '/blog' }: { apiBase?: string; basePath?: string }) {
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    fetch(`${apiBase}/api/posts`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setPosts(Array.isArray(d) ? d : []))
      .catch(() => setPosts([]));
  }, [apiBase]);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16 text-white">
      <div className="font-mono text-[11px] tracking-[3px] text-red-400">BLOG</div>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight">Aprende conmigo</h1>

      {posts === null && <p className="mt-8 text-neutral-500">Cargando…</p>}
      {posts && posts.length === 0 && <p className="mt-8 text-neutral-500">Pronto publicaremos contenido nuevo.</p>}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts?.map((p) => (
          <a key={p.slug} href={`${basePath}/${p.slug}`}
             className="group overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 transition hover:border-red-700">
            <div className="aspect-[16/9] bg-neutral-900" style={p.cover_url ? { backgroundImage: `url(${p.cover_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined} />
            <div className="p-5">
              {!!p.tags?.length && <div className="font-mono text-[10px] uppercase tracking-wide text-red-400">{p.tags[0]}</div>}
              <h2 className="mt-1 text-lg font-bold leading-snug group-hover:text-red-400">{p.title}</h2>
              {p.excerpt && <p className="mt-2 line-clamp-3 text-sm text-neutral-400">{p.excerpt}</p>}
              <div className="mt-4 font-mono text-[11px] text-neutral-500">
                {p.author || 'Carolina'}{p.published_at ? ` · ${new Date(p.published_at).toLocaleDateString('es-CO')}` : ''}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

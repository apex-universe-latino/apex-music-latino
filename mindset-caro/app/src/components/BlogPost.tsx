// BlogPost.tsx — single blog post (Mindset Caro). Standalone Tailwind drop-in.
//   <BlogPost slug={slugFromRoute} apiBase="" basePath="/blog" />
// Fetches GET /api/posts?slug=... . `body` may be HTML or markdown-ish; rendered as HTML.
// NOTE: set the document <title> + canonical to https://mindsetcaro.com/blog/{slug} for SEO
//       (do it in the route component / head manager of the app).

import { useEffect, useState } from 'react';
import { RETIRED_ASSET_RE } from '../config';

type Post = {
  slug: string; title: string; excerpt?: string; body?: string; cover_url?: string;
  author?: string; tags?: string[]; published_at?: string;
};

export default function BlogPost({ slug, apiBase = '', basePath = '/blog' }: { slug: string; apiBase?: string; basePath?: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`${apiBase}/api/posts?slug=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setPost(d || null);
        setLoading(false);
      })
      .catch(() => {
        setPost(null);
        setLoading(false);
      });
  }, [apiBase, slug]);

  if (loading) return <div className="mx-auto max-w-2xl px-6 py-20 text-neutral-500">Cargando…</div>;
  if (post === null) return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center text-white">
      <p className="text-neutral-400">No encontramos este artículo.</p>
      <a href={basePath} className="mt-4 inline-block text-crimson-glow hover:underline">← Volver al blog</a>
    </div>
  );

  return (
    <article className="mx-auto max-w-2xl px-6 py-16 text-white">
      <a href={basePath} className="font-mono text-[11px] text-crimson-glow hover:underline">← Blog</a>
      {!!post.tags?.length && <div className="mt-6 font-mono text-[10px] uppercase tracking-wide text-crimson-glow">{post.tags.join(' · ')}</div>}
      <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight">{post.title}</h1>
      <div className="mt-3 font-mono text-[12px] text-neutral-500">
        {post.author || 'Carolina'}{post.published_at ? ` · ${new Date(post.published_at).toLocaleDateString('es-CO')}` : ''}
      </div>
      {post.cover_url && !RETIRED_ASSET_RE.test(post.cover_url) && <img src={post.cover_url} alt={post.title} className="mt-8 w-full rounded-2xl border border-neutral-800" />}
      {post.excerpt && <p className="mt-8 text-lg text-neutral-300">{post.excerpt}</p>}
      <div
        className="prose prose-invert mt-6 max-w-none prose-headings:font-bold prose-a:text-crimson-glow"
        dangerouslySetInnerHTML={{ __html: post.body || '' }}
      />
    </article>
  );
}

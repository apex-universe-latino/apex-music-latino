// BlogPost.tsx — single blog post (Mindset Caro).
// GET /api/posts?slug=… returns the post with `body_html` (Markdown rendered on the server,
// same rules as the /cms preview). The server also pre-renders this page's <head> and
// article for crawlers (api/data.js action=blogpage); Helmet keeps the head right on
// in-app navigation.

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { RETIRED_ASSET_RE } from '../config';
import { useUi } from '../ui';
import { SEOHead } from './SEOHead';
import NotFound from '../pages/NotFound';

type Post = {
  slug: string; title: string; excerpt?: string; body?: string; body_html?: string;
  cover_url?: string; cover_alt?: string; seo_title?: string; seo_description?: string;
  author?: string; tags?: string[]; published_at?: string;
};

const SITE = 'https://www.mindsetcaro.com';

export default function BlogPost({ slug, apiBase = '', basePath = '/blog' }: { slug: string; apiBase?: string; basePath?: string }) {
  const { openDiagnostic } = useUi();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`${apiBase}/api/posts?slug=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { setPost(d || null); setLoading(false); })
      .catch(() => { setPost(null); setLoading(false); });
  }, [apiBase, slug]);

  if (loading) return <div className="mx-auto max-w-2xl px-6 py-20 text-white/50">Cargando…</div>;
  if (post === null) return <NotFound blog />;

  const cover = post.cover_url && !RETIRED_ASSET_RE.test(post.cover_url) ? post.cover_url : null;
  const coverAbs = cover ? (cover.startsWith('http') ? cover : `${SITE}${cover}`) : undefined;

  return (
    <article className="mx-auto max-w-2xl px-5 py-14 text-white sm:px-6 sm:py-20">
      <SEOHead
        title={post.seo_title || `${post.title} | Mindset Caro`}
        rawTitle
        description={post.seo_description || post.excerpt || ''}
        canonicalUrl={`${SITE}/blog/${post.slug}`}
        ogImage={coverAbs}
        type="article"
      />
      <a href={basePath} className="font-mono text-[11px] uppercase tracking-[0.2em] text-crimson-glow hover:underline">← Blog</a>
      {!!post.tags?.length && <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">{post.tags.join(' · ')}</div>}
      <h1 className="mt-2 text-[2.1rem] font-black leading-[1.05] tracking-tight sm:text-5xl">{post.title}</h1>
      <div className="mt-4 font-mono text-[12px] text-white/45">
        {post.author || 'Mindset Caro'}{post.published_at ? ` · ${new Date(post.published_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}
      </div>
      {cover && <img src={cover} alt={post.cover_alt || post.title} className="mt-8 w-full rounded-2xl border border-white/10" />}
      {post.excerpt && <p className="mt-8 text-lg leading-relaxed text-white/75">{post.excerpt}</p>}
      <div className="mc-prose mt-6" dangerouslySetInnerHTML={{ __html: post.body_html ?? post.body ?? '' }} />

      <aside className="mt-14 rounded-2xl border border-crimson/40 bg-dark-lighter p-6 sm:p-8">
        <p className="eyebrow">Diagnóstico gratis · 3 minutos</p>
        <p className="mt-3 text-2xl font-extrabold tracking-tight">¿Qué tan blindado estás hoy?</p>
        <p className="mt-2 text-white/65">Responde 5 preguntas y ve tu resultado en pantalla, sin compromiso.</p>
        <button type="button" onClick={openDiagnostic} className="btn-primary group mt-5">
          Haz tu diagnóstico gratis <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </button>
      </aside>
    </article>
  );
}

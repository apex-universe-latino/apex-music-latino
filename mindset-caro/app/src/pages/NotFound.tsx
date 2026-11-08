import { Helmet } from 'react-helmet-async';
import { SEOHead } from '../components/SEOHead';

/** Real "not found" page: noindex, plus a way back to the blog and the diagnostic.
 *  On www.mindsetcaro.com the server already answers unknown URLs with HTTP 404
 *  (api/data.js action=notfound / blogpage); this keeps the SPA consistent. */
export default function NotFound({ blog = false }: { blog?: boolean }) {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24 text-center text-graphite">
      <SEOHead title="Página no encontrada" description="Esta página no existe o ya no está publicada." canonicalUrl="https://www.mindsetcaro.com/" />
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Página no encontrada</h1>
      <p className="mt-4 text-lg text-graphite/65">
        {blog ? 'Este artículo no existe o ya no está publicado.' : 'La página que buscas no existe o cambió de dirección.'}
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <a href="/blog" className="btn-primary">Ir al blog</a>
        <a href="/diagnostico" className="inline-flex items-center justify-center rounded-xl border border-graphite/20 px-6 py-3 font-bold text-graphite hover:border-crimson">Haz tu diagnóstico gratis</a>
      </div>
    </section>
  );
}

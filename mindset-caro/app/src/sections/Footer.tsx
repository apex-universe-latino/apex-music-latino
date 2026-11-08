import { Link } from 'react-router-dom';
import Brand from '../components/Brand';
import { BIO, COMMUNITY_URL, DISCLAIMER, media } from '../config';
import { useGoToSection } from '../lib/nav';

export default function Footer() {
  const go = useGoToSection();
  const link = 'text-graphite/60 hover:text-graphite';
  return (
    <footer className="bg-forest">
      <div className="rainbow-divider" aria-hidden />
      <div className="px-4 pb-28 pt-14 sm:px-6 sm:pb-12">
        <div className="wrap">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Brand size="md" />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-graphite/55">{BIO}</p>
            </div>
            <nav aria-label="Blindaje Patrimonial" className="text-sm">
              <p className="eyebrow mb-3 !text-graphite/40">Blindaje</p>
              <ul className="space-y-2">
                <li><button type="button" onClick={() => go('que-es')} className={link}>Qué es</button></li>
                <li><button type="button" onClick={() => go('como-funciona')} className={link}>Cómo funciona</button></li>
                <li><button type="button" onClick={() => go('liquidez')} className={link}>Liquidez para tu familia</button></li>
                <li><Link to="/diagnostico" className={link}>Diagnóstico gratis</Link></li>
              </ul>
            </nav>
            <nav aria-label="Metas" className="text-sm">
              <p className="eyebrow mb-3 !text-graphite/40">Metas</p>
              <ul className="space-y-2">
                <li><button type="button" onClick={() => go('jubilacion')} className={link}>Jubilación</button></li>
                <li><button type="button" onClick={() => go('educacion')} className={link}>Educación de tus hijos</button></li>
                <li><button type="button" onClick={() => go('dolares')} className={link}>Invertir en dólares</button></li>
              </ul>
            </nav>
            <nav aria-label="Más" className="text-sm">
              <p className="eyebrow mb-3 !text-graphite/40">Más</p>
              <ul className="space-y-2">
                <li><button type="button" onClick={() => go('casos')} className={link}>Casos</button></li>
                <li><Link to="/blog" className={link}>Blog</Link></li>
                <li><a href={COMMUNITY_URL} className={link}>Comunidad</a></li>
                <li><Link to="/privacidad" className={link}>Política de privacidad</Link></li>
              </ul>
            </nav>
          </div>
          <p className="mt-12 border-t border-white/[.07] pt-6 text-xs leading-relaxed text-graphite/45">{DISCLAIMER}</p>
          <p className="mt-3 text-xs leading-relaxed text-graphite/35">
            La información de este sitio es educativa y no constituye asesoría financiera personalizada ni una oferta de un producto específico.
            &copy; {new Date().getFullYear()} Mindset Caro.
          </p>
          <p className="mt-4 text-xs text-graphite/35">
            <a href="https://gsd500bpo.com" className="inline-flex items-center gap-2 transition-colors hover:text-graphite/70">
              <img src={media('brand/gsd500bpo.webp')} alt="GSD 500 BPO" width={18} height={18} loading="lazy" className="rounded-sm opacity-80" />
              Desarrollado por GSD 500 BPO
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

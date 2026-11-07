import { Link } from 'react-router-dom';
import Brand from '../components/Brand';
import { BIO, COMMUNITY_URL, DISCLAIMER } from '../config';
import { useGoToSection } from '../lib/nav';

export default function Footer() {
  const go = useGoToSection();
  const link = 'text-white/60 hover:text-white';
  return (
    <footer className="bg-black">
      <div className="rainbow-divider" aria-hidden />
      <div className="px-4 pb-28 pt-14 sm:px-6 sm:pb-12">
        <div className="wrap">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Brand size="md" />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">{BIO}</p>
            </div>
            <nav aria-label="Blindaje Patrimonial" className="text-sm">
              <p className="eyebrow mb-3 !text-white/40">Blindaje</p>
              <ul className="space-y-2">
                <li><button type="button" onClick={() => go('que-es')} className={link}>Qué es</button></li>
                <li><button type="button" onClick={() => go('como-funciona')} className={link}>Cómo funciona</button></li>
                <li><button type="button" onClick={() => go('liquidez')} className={link}>Liquidez para tu familia</button></li>
                <li><Link to="/diagnostico" className={link}>Diagnóstico gratis</Link></li>
              </ul>
            </nav>
            <nav aria-label="Metas" className="text-sm">
              <p className="eyebrow mb-3 !text-white/40">Metas</p>
              <ul className="space-y-2">
                <li><button type="button" onClick={() => go('jubilacion')} className={link}>Jubilación</button></li>
                <li><button type="button" onClick={() => go('educacion')} className={link}>Educación de tus hijos</button></li>
                <li><button type="button" onClick={() => go('dolares')} className={link}>Invertir en dólares</button></li>
              </ul>
            </nav>
            <nav aria-label="Más" className="text-sm">
              <p className="eyebrow mb-3 !text-white/40">Más</p>
              <ul className="space-y-2">
                <li><button type="button" onClick={() => go('casos')} className={link}>Casos</button></li>
                <li><Link to="/blog" className={link}>Blog</Link></li>
                <li><a href={COMMUNITY_URL} target="_blank" rel="noopener" className={link}>Comunidad</a></li>
                <li><Link to="/privacidad" className={link}>Política de privacidad</Link></li>
              </ul>
            </nav>
          </div>
          <p className="mt-12 border-t border-white/[.07] pt-6 text-xs leading-relaxed text-white/45">{DISCLAIMER}</p>
          <p className="mt-3 text-xs leading-relaxed text-white/35">
            La información de este sitio es educativa y no constituye asesoría financiera personalizada ni una oferta de un producto específico.
            &copy; {new Date().getFullYear()} Mindset Caro.
          </p>
        </div>
      </div>
    </footer>
  );
}

import { Link } from 'react-router-dom';
import { DISCLAIMER } from '../config';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 pb-28 pt-12 sm:px-6 sm:pb-12">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-xl font-black tracking-tighter">MINDSET<span className="text-crimson">CARO</span></p>
            <p className="mt-1 text-sm text-white/55">Blindaje Patrimonial · Carolina Veci, asesora en protección y ahorro.</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-white/70">
            <Link to="/" className="hover:text-white">Inicio</Link>
            <Link to="/diagnostico" className="hover:text-white">Diagnóstico</Link>
            <Link to="/blog" className="hover:text-white">Blog</Link>
            <Link to="/privacidad" className="hover:text-white">Política de privacidad</Link>
          </nav>
        </div>
        <p className="mt-8 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/50">{DISCLAIMER}</p>
        <p className="mt-3 text-xs leading-relaxed text-white/40">
          La información de este sitio es educativa y no constituye asesoría financiera personalizada ni una oferta de un producto específico.
          &copy; {new Date().getFullYear()} Mindset Caro.
        </p>
      </div>
    </footer>
  );
}

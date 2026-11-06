
import { ArrowRight, ShieldCheck, TrendingUp, Brain } from 'lucide-react';

interface HeroProps {
  onStartDiagnostic: () => void;
  cmsData: any;
}

export default function Hero({ onStartDiagnostic, cmsData }: HeroProps) {
  const titleText = cmsData?.['hero.title'] || "El Mindset Correcto para Blindar tu Futuro";
  const subtitleText = cmsData?.['hero.subtitle'] || "Descubre tu ruta hacia la libertad financiera, el dominio de ventas y la protección patrimonial. Diagnóstico en 3 minutos.";

  // Split title if it contains "Correcto" to keep the styling
  const titleParts = titleText.split('Correcto');

  return (
    <div className="relative overflow-hidden bg-dark">
      {/* Background gradients and glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-crimson/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 relative z-10">
        <div className="text-center md:text-left grid md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-crimson/30 bg-crimson/10 text-crimson text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-crimson animate-pulse"></span>
              Metodología Probada
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
              {titleParts.length > 1 ? (
                <>
                  {titleParts[0]}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-crimson to-crimson-glow">
                    Correcto
                  </span>
                  {titleParts[1]}
                </>
              ) : (
                titleText
              )}
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
              {subtitleText}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button 
                onClick={onStartDiagnostic}
                className="group relative inline-flex items-center justify-center gap-3 bg-crimson text-white px-8 py-4 rounded-lg font-bold text-lg overflow-hidden transition-all hover:scale-105"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                Inicia tu Diagnóstico
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          
          {/* Visual Placeholder (Cinematic) */}
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent z-10"></div>
            <img 
              src="/mindset-caro/carolina.jpg" 
              alt="Mindset Caro - Carolina Veci" 
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute bottom-8 left-8 right-8 z-20 grid grid-cols-3 gap-4">
               <div className="bg-dark/60 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center">
                 <ShieldCheck className="w-6 h-6 text-crimson mx-auto mb-2" />
                 <span className="text-xs font-medium uppercase tracking-wider">Seguros</span>
               </div>
               <div className="bg-dark/60 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center">
                 <TrendingUp className="w-6 h-6 text-crimson mx-auto mb-2" />
                 <span className="text-xs font-medium uppercase tracking-wider">Ventas</span>
               </div>
               <div className="bg-dark/60 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center">
                 <Brain className="w-6 h-6 text-crimson mx-auto mb-2" />
                 <span className="text-xs font-medium uppercase tracking-wider">Mindset</span>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

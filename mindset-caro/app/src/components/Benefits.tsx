import { Check } from 'lucide-react';

const defaultBenefits = [
  'Garantiza tu retiro con capital asegurado',
  'Invierte en el S&P 500 y portafolios globales',
  'Protege a tu familia ante lo inesperado',
  'Asegura la educación de tus hijos'
];

export default function Benefits({ cmsData }: { cmsData?: any }) {
  const benefits = [
    cmsData?.['benefit.1'] || defaultBenefits[0],
    cmsData?.['benefit.2'] || defaultBenefits[1],
    cmsData?.['benefit.3'] || defaultBenefits[2],
    cmsData?.['benefit.4'] || defaultBenefits[3],
  ];

  return (
    <div className="bg-dark-lighter border-y border-white/10 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="font-mono text-xs font-bold tracking-[3px] text-red-400 uppercase mb-4">CON QUÉ TE AYUDO</div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6 tracking-tight">Decisiones estratégicas, con respaldo.</h2>
            <p className="text-lg text-gray-400 leading-relaxed max-w-lg">Una estructura financiera sólida y con propósito, diseñada para tu momento de vida.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex gap-4 items-start bg-dark border border-white/5 rounded-xl p-5 hover:border-red-500/30 transition-colors shadow-lg">
                <span className="flex-none w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                  <Check className="w-5 h-5" />
                </span>
                <span className="text-gray-200 text-sm leading-relaxed">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

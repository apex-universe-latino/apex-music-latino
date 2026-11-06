import { TrendingUp, ShieldCheck, Brain } from 'lucide-react';

interface PillarsProps {
  cmsData?: any;
}

export default function Pillars({ cmsData }: PillarsProps) {
  const pillars = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-crimson" />,
      title: cmsData?.['pillars.p1.title'] || "Blindaje Patrimonial",
      desc: cmsData?.['pillars.p1.desc'] || "Protege tu riqueza familiar de devaluaciones, demandas y crisis económicas locales. Estructuras de seguro de vida americano."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-crimson" />,
      title: cmsData?.['pillars.p2.title'] || "Libertad Financiera",
      desc: cmsData?.['pillars.p2.desc'] || "Estrategias de interés compuesto y dividendos libres de impuestos para tu retiro."
    },
    {
      icon: <Brain className="w-8 h-8 text-crimson" />,
      title: cmsData?.['pillars.p3.title'] || "Dominio de Ventas",
      desc: cmsData?.['pillars.p3.desc'] || "La habilidad #1 de los millonarios. Técnicas de cierre, prospección B2B y objeciones."
    }
  ];

  return (
    <div className="py-24 bg-dark-lighter relative border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Tus 3 Pilares de Crecimiento</h2>
          <p className="text-gray-400 text-lg">El éxito verdadero requiere una base sólida. Nos enfocamos en las áreas que realmente importan para transformar tu realidad.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <div key={i} className="bg-dark border border-white/5 p-8 rounded-2xl hover:border-crimson/50 hover:-translate-y-2 transition-all duration-300 group shadow-lg">
              <div className="w-16 h-16 bg-crimson/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-crimson/20 transition-colors">
                {pillar.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{pillar.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

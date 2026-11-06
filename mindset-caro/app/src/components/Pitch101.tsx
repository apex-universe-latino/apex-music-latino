export default function Pitch101({ cmsData }: { cmsData?: any }) {
  const steps = [
    {
      n: '1',
      title: cmsData?.['step.1'] || 'Gira la ruleta',
      body: 'Descubre al instante qué recurso gratuito te toca.'
    },
    {
      n: '2',
      title: cmsData?.['step.2'] || 'Calcula tu protección',
      body: 'Una estimación clara de cuánto necesitas para blindar tu futuro.'
    },
    {
      n: '3',
      title: cmsData?.['step.3'] || 'Recibe tu plan',
      body: 'Carolina te contacta con el siguiente paso, sin compromiso.'
    }
  ];

  return (
    <div className="relative pt-32 pb-24 overflow-hidden border-b border-white/10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-block font-mono text-xs font-bold tracking-[3px] text-red-400 border border-red-500/20 bg-red-500/5 px-4 py-2 rounded-full mb-8">
          DIAGNÓSTICO GRATUITO · 60 SEGUNDOS
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight mb-6">
          Descubre tu plan para <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">blindar tu futuro.</span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-16">
          Sin llamadas incómodas ni formularios eternos. Gira, calcula y recibe el recurso exacto para tu momento — al instante.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 text-left">
          {steps.map((s, i) => (
            <div key={i} className="bg-dark-lighter border border-white/10 rounded-2xl p-8 hover:border-red-600/40 transition-colors shadow-lg">
              <div className="text-4xl font-black text-red-600 mb-4">{s.n}</div>
              <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

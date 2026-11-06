import { PlayCircle, Headphones } from 'lucide-react';

interface MediaProps {
  cmsData?: any;
}

export default function MediaShowcase({ cmsData }: MediaProps) {
  const content = [
    {
      type: 'Podcast',
      title: cmsData?.['media.title'] || "Mindset Inquebrantable",
      subtitle: cmsData?.['media.subtitle'] || "Episodios semanales sobre psicología del dinero y ventas.",
      duration: '45 min',
      icon: <Headphones className="w-5 h-5" />,
      img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800'
    },
    {
      type: 'Masterclass',
      title: 'Ventas High-Ticket',
      subtitle: 'Cómo cerrar pólizas de 5 cifras con clientes corporativos.',
      duration: '1 min',
      icon: <PlayCircle className="w-5 h-5" />,
      img: 'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=800'
    },
    {
      type: 'Podcast',
      title: 'Ep. 44: Cómo Blindar tu Patrimonio Familiar',
      subtitle: 'Estrategias de protección legal y financiera.',
      duration: '52 min',
      icon: <Headphones className="w-5 h-5" />,
      img: 'https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?auto=format&fit=crop&q=80&w=600'
    }
  ];

  return (
    <div className="py-24 bg-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold text-white mb-4">Aprende Conmigo</h2>
            <p className="text-gray-400 text-lg">Sintoniza el podcast "Mindset Caro" o mira mis últimos reels para consejos rápidos de alto impacto.</p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-crimson hover:text-white transition-colors mt-4 md:mt-0 font-medium">
            Ver Todo el Contenido <PlayCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {content.map((item, i) => (
            <div key={i} className="group cursor-pointer relative rounded-2xl overflow-hidden border border-white/10 aspect-square md:aspect-[4/5]">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100 grayscale group-hover:grayscale-0" />
              
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent"></div>
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-2 text-crimson font-semibold text-sm uppercase tracking-wider mb-2">
                  {item.icon} {item.type} • {item.duration}
                </div>
                <h3 className="text-xl font-bold text-white leading-snug group-hover:text-crimson transition-colors">{item.title}</h3>
              </div>
              
              {/* Play Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-dark/20 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-crimson text-white flex items-center justify-center shadow-[0_0_30px_rgba(230,0,0,0.5)]">
                  <PlayCircle className="w-8 h-8" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="md:hidden w-full flex justify-center items-center gap-2 text-crimson border border-crimson rounded-lg py-3 mt-8 hover:bg-crimson hover:text-white transition-colors font-medium">
          Ver Todo el Contenido <PlayCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

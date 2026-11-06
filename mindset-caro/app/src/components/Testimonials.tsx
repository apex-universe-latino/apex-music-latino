import { Quote } from 'lucide-react';

const defaultTestimonials = [
  {
    quote: 'Reemplazar con un testimonio real de una clienta — cercano y aterrizado a su momento de vida.',
    name: '— Nombre, Ciudad'
  },
  {
    quote: 'Reemplazar con un segundo testimonio real que hable de tranquilidad y respaldo.',
    name: '— Nombre, Ciudad'
  }
];

export default function Testimonials({ cmsData }: { cmsData?: any }) {
  const testimonials = [
    {
      quote: cmsData?.['testimonial.1'] || defaultTestimonials[0].quote,
      name: cmsData?.['testimonial.1.name'] || defaultTestimonials[0].name,
    },
    {
      quote: cmsData?.['testimonial.2'] || defaultTestimonials[1].quote,
      name: cmsData?.['testimonial.2.name'] || defaultTestimonials[1].name,
    }
  ];

  return (
    <div className="bg-dark-lighter border-y border-white/10 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="font-mono text-xs font-bold tracking-[3px] text-red-400 uppercase mb-4">TESTIMONIOS</div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-12">Familias que ya viven con tranquilidad</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-dark border border-white/5 rounded-2xl p-8 relative hover:border-red-500/30 transition-colors shadow-lg">
              <Quote className="w-10 h-10 text-red-600 mb-6 opacity-80" />
              <p className="text-lg text-gray-300 leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div className="font-mono text-sm font-semibold text-gray-500">{t.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

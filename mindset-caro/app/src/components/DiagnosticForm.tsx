import { useState } from 'react';
import { X, ArrowRight, CheckCircle2, Globe } from 'lucide-react';

interface DiagnosticFormProps {
  onClose: () => void;
}

type Lang = 'es' | 'en';

const LABELS = {
  es: {
    title: 'Tu Diagnóstico',
    subtitle: 'Completa este breve formulario para desbloquear tu Lead Magnet y ruta de acción.',
    step1Question: '¿Cuál es tu objetivo principal hoy?',
    objectives: [
      { id: 'seguros', label: 'Proteger a mi familia (Seguros)' },
      { id: 'ventas', label: 'Multiplicar mis ventas' },
      { id: 'mindset', label: 'Mejorar mi mindset financiero' }
    ],
    nombre: 'Nombre Completo',
    nombrePlaceholder: 'Carolina Veci',
    email: 'Correo Electrónico',
    emailPlaceholder: 'caro@ejemplo.com',
    whatsapp: 'WhatsApp / Teléfono',
    whatsappPlaceholder: '+1 234 567 8900',
    education: 'Nivel de Educación',
    educationPlaceholder: 'Selecciona tu nivel de educación',
    educationOptions: [
      { value: 'Bachillerato', label: 'Bachillerato' },
      { value: 'Técnico/Tecnólogo', label: 'Técnico/Tecnólogo' },
      { value: 'Universitario', label: 'Universitario' },
      { value: 'Posgrado', label: 'Posgrado' },
      { value: 'Otro', label: 'Otro' }
    ],
    submit: 'Desbloquear mi Lead Magnet',
    submitting: 'Procesando...',
    back: 'Volver',
    successTitle: '¡Diagnóstico Completado!',
    successDesc: 'Revisa tu correo electrónico o WhatsApp. Te hemos enviado tu ruta de acción personalizada.'
  },
  en: {
    title: 'Your Diagnostic',
    subtitle: 'Complete this brief form to unlock your Lead Magnet and action roadmap.',
    step1Question: 'What is your main objective today?',
    objectives: [
      { id: 'seguros', label: 'Protect my family (Insurance)' },
      { id: 'ventas', label: 'Multiply my sales' },
      { id: 'mindset', label: 'Improve my financial mindset' }
    ],
    nombre: 'Full Name',
    nombrePlaceholder: 'Carolina Veci',
    email: 'Email Address',
    emailPlaceholder: 'caro@example.com',
    whatsapp: 'WhatsApp / Phone',
    whatsappPlaceholder: '+1 234 567 8900',
    education: 'Education Level',
    educationPlaceholder: 'Select your education level',
    educationOptions: [
      { value: 'High school', label: 'High school' },
      { value: 'Technical', label: 'Technical' },
      { value: 'University', label: 'University' },
      { value: 'Postgraduate', label: 'Postgraduate' },
      { value: 'Other', label: 'Other' }
    ],
    submit: 'Unlock my Lead Magnet',
    submitting: 'Processing...',
    back: 'Back',
    successTitle: 'Diagnostic Completed!',
    successDesc: 'Check your email or WhatsApp. We have sent your personalized action roadmap.'
  }
};

export default function DiagnosticForm({ onClose }: DiagnosticFormProps) {
  const [lang, setLang] = useState<Lang>('es');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    objective: '',
    nombre: '',
    email: '',
    whatsapp: '',
    education: ''
  });

  const t = LABELS[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const visitorId = `v_${Math.random().toString(36).substring(2, 10)}`;
    const payload = {
      source: 'flip-form',
      objective: formData.objective,
      nombre: formData.nombre,
      email: formData.email,
      whatsapp: formData.whatsapp,
      education: formData.education,
      visitor_id: visitorId,
      utm: window.location.search
    };

    try {
      const leadApiUrl = window.location.origin.includes('localhost')
        ? 'https://apexmusiclatino.com/api/data.js?action=lead'
        : '/api/lead';

      await fetch(leadApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const ingestApiUrl = window.location.origin.includes('localhost')
        ? 'https://apexmusiclatino.com/api/data.js?action=ingest'
        : '/api/ingest';

      await fetch(ingestApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_app: 'mindset-caro-site',
          event: 'lead_captured',
          visitor_id: visitorId,
          payload: { objective: formData.objective, education: formData.education },
          utm: window.location.search
        })
      });

      setSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-dark-lighter border border-white/10 rounded-2xl p-8 max-w-md w-full text-center relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">{t.successTitle}</h3>
        <p className="text-gray-400">{t.successDesc}</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-lighter border border-white/10 rounded-2xl p-8 max-w-md w-full relative shadow-[0_0_50px_rgba(230,0,0,0.1)]">
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <button 
          onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-2 py-1 rounded border border-white/10 hover:border-white/30 transition-colors"
          title="Toggle Language / Cambiar Idioma"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="uppercase font-semibold">{lang}</span>
        </button>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">{t.title}</h3>
        <p className="text-gray-400 text-sm">{t.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <label className="block text-sm font-medium text-gray-300">{t.step1Question}</label>
            <div className="space-y-3">
              {t.objectives.map((obj) => (
                <button
                  key={obj.id}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, objective: obj.id });
                    setStep(2);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg border border-white/10 hover:border-crimson hover:bg-crimson/10 transition-colors"
                >
                  {obj.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-8">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t.nombre}</label>
              <input 
                required
                type="text" 
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson"
                placeholder={t.nombrePlaceholder}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t.email}</label>
              <input 
                required
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson"
                placeholder={t.emailPlaceholder}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t.whatsapp}</label>
              <input 
                required
                type="tel" 
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson"
                placeholder={t.whatsappPlaceholder}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t.education}</label>
              <select
                required
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson"
              >
                <option value="" disabled>{t.educationPlaceholder}</option>
                {t.educationOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-crimson hover:bg-crimson-glow text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? t.submitting : t.submit}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>

            <button 
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-sm text-gray-400 hover:text-white"
            >
              {t.back}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

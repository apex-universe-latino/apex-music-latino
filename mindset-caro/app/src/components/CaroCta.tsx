import { MessageCircle } from 'lucide-react';
import { caroWhatsappLink } from '../lib/lead';
import { useUi } from '../ui';

/** "Habla con Caro": WhatsApp when her number is configured, otherwise the Caro IA bot
 *  (which can take their number so Caro writes first). */
export default function CaroCta({ text = 'Hola Caro, quiero saber más sobre el Blindaje Patrimonial.', className = 'btn-ghost', label = 'Habla con Caro' }: {
  text?: string; className?: string; label?: string;
}) {
  const { openBot } = useUi();
  const href = caroWhatsappLink(text);
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener" className={className}>
        <MessageCircle className="h-5 w-5" aria-hidden /> {label}
      </a>
    );
  }
  return (
    <button type="button" onClick={() => openBot('talk')} className={className}>
      <MessageCircle className="h-5 w-5" aria-hidden /> {label}
    </button>
  );
}

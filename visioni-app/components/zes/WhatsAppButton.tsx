import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
  // Sostituisci con il tuo numero reale in formato internazionale senza +
  // Es: 393408039322
  const phoneNumber = "393408039322"; 
  const message = "Salve, vorrei maggiori informazioni sui servizi ZES.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-xl hover:bg-[#20bd5a] transition-all duration-300 hover:scale-110 flex items-center gap-2 group"
      aria-label="Chatta su WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold">
        Chatta con noi
      </span>
    </a>
  );
};

export default WhatsAppButton;
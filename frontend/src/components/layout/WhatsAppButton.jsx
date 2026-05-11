import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../../utils/constants';

const WhatsAppButton = () => {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat on WhatsApp"
    >
      <div className="relative">
        {/* Pulse ring */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20" />

        {/* Button */}
        <div className="relative w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 group-hover:shadow-[#25D366]/30">
          <MessageCircle className="w-7 h-7 text-white" />

          {/* Tooltip */}
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-[#1a1a1e] border border-[#2a2a2e] rounded-lg px-4 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap">
            <span className="text-sm text-[#f8f4ef]">Chat with us</span>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-8 border-transparent border-r-0 border-l-[#2a2a2e]" />
          </div>
        </div>
      </div>
    </a>
  );
};

export default WhatsAppButton;
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md mx-4 bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl shadow-2xl animate-fadeInUp">
        <div className="flex items-center justify-between p-6 border-b border-[#2a2a2e]">
          <h3 className="font-display text-lg text-[#f8f4ef]">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 text-[#6b6b6b] hover:text-[#f8f4ef] hover:bg-[#2a2a2e] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
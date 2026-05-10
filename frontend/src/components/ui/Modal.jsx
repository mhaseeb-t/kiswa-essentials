import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md mx-4 bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-[#2e2e2e]">
          <h3 className="text-lg font-medium text-[#f5f0e8]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-[#888888] hover:text-[#f5f0e8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
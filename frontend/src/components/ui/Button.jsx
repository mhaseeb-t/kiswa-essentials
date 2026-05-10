import { forwardRef } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#c9b89a] text-[#0c0c0e] hover:bg-[#d4c9a8] active:scale-95',
    outline: 'border-2 border-[#2a2a2e] text-[#f8f4ef] hover:border-[#c9b89a]/50 hover:bg-[#1a1a1e]/50 active:scale-95',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-95',
    ghost: 'text-[#a8a4a0] hover:text-[#f8f4ef] hover:bg-[#1a1a1e]/50',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  type = 'text',
  placeholder,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[#a8a4a0]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3
          bg-[#0c0c0e] border border-[#2a2a2e] rounded-xl
          text-[#f8f4ef] placeholder-[#6b6b6b]
          focus:outline-none focus:border-[#c9b89a]/50 focus:ring-1 focus:ring-[#c9b89a]/30
          transition-all duration-300
          ${error ? 'border-red-500/50' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-400">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
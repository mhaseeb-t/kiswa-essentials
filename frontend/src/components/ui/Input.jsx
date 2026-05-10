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
        <label className="text-sm font-medium text-[#888888]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`
          w-full px-4 py-2.5
          bg-[#1a1a1a] border border-[#2e2e2e] rounded
          text-[#f5f0e8] placeholder-[#888888]
          focus:outline-none focus:border-[#c9b89a] focus:ring-1 focus:ring-[#c9b89a]
          transition-all duration-300
          ${error ? 'border-[#ef4444]' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-sm text-[#ef4444]">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
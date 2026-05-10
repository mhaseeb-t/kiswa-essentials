const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-[#2a2a2e] text-[#a8a4a0]',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/20 text-red-400',
    info: 'bg-blue-500/20 text-blue-400',
  };

  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
};

export default Badge;
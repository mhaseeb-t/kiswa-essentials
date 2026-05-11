import { Star } from 'lucide-react';

const StarRating = ({ rating, size = 'md', interactive = false, onChange = null }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (index) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => handleClick(index)}
          disabled={!interactive}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
        >
          <Star
            className={`${sizes[size]} ${
              index < rating
                ? 'text-[#c9b89a] fill-[#c9b89a]'
                : 'text-[#2a2a2e]'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
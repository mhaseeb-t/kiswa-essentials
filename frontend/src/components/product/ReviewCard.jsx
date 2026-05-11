import StarRating from './StarRating';
import { CheckCircle, ThumbsUp } from 'lucide-react';

const ReviewCard = ({ review, index = 0 }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-6 animate-fadeInUp"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#c9b89a]/20 flex items-center justify-center text-[#c9b89a] font-medium text-sm">
            {getInitials(review.user_name)}
          </div>
          <div>
            <h4 className="text-[#f8f4ef] font-medium">{review.user_name || 'Anonymous'}</h4>
            <p className="text-xs text-[#6b6b6b]">{formatDate(review.created_at)}</p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>

      {review.comment && (
        <p className="text-[#a8a4a0] leading-relaxed mb-4">{review.comment}</p>
      )}

      {review.has_verified_purchase && (
        <div className="flex items-center gap-2 text-xs text-[#c9b89a]">
          <CheckCircle className="w-4 h-4" />
          <span>Verified Purchase</span>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
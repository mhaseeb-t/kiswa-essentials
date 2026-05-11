import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import { Send } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-chi-drab-54.vercel.app/api';

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess('Review submitted successfully!');
        setRating(0);
        setComment('');
        if (onReviewAdded) onReviewAdded();
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-6 text-center">
        <p className="text-[#a8a4a0] mb-4">Please sign in to leave a review</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-[#c9b89a] text-[#0c0c0e] font-medium rounded-full hover:bg-[#d4c9a8] transition-all"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-6">
      <h3 className="text-[#f8f4ef] font-display text-xl mb-6">Write a Review</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
          {success}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-[#a8a4a0] text-sm mb-3">Your Rating</label>
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setRating(index + 1)}
              onMouseEnter={() => setHoverRating(index + 1)}
              onMouseLeave={() => setHoverRating(0)}
              className="cursor-pointer hover:scale-110 transition-transform"
            >
              <StarRating
                rating={hoverRating || rating}
                size="lg"
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-[#6b6b6b]">
            {rating > 0 ? `${rating} out of 5` : 'Select rating'}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-[#a8a4a0] text-sm mb-3">Your Review (optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={4}
          className="w-full p-4 bg-[#0c0c0e] border border-[#2a2a2e] rounded-xl text-[#f8f4ef] placeholder-[#6b6b6b] focus:outline-none focus:border-[#c9b89a] transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="w-full flex items-center justify-center gap-2 py-4 bg-[#c9b89a] text-[#0c0c0e] font-medium rounded-full hover:bg-[#d4c9a8] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-[#0c0c0e]/30 border-t-[#0c0c0e] rounded-full animate-spin" />
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit Review
          </>
        )}
      </button>
    </form>
  );
};

export default ReviewForm;
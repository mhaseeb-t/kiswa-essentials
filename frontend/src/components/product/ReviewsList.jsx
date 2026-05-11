import { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import StarRating from './StarRating';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-chi-drab-54.vercel.app/api';

const ReviewsList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ total: 0, average: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/products/${productId}/reviews?page=${page}&limit=${limit}`);
        const data = await res.json();
        if (data.success) {
          setReviews(data.reviews || []);
          setStats(data.stats || { total: 0, average: 0 });
          setTotalPages(Math.ceil(data.pagination?.total / limit) || 1);
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchReviews();
  }, [productId, page]);

  const renderRatingBars = () => {
    const ratings = [5, 4, 3, 2, 1];
    return (
      <div className="space-y-2">
        {ratings.map((star) => (
          <div key={star} className="flex items-center gap-3">
            <span className="text-sm text-[#6b6b6b] w-6">{star}★</span>
            <div className="flex-1 h-2 bg-[#2a2a2e] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#c9b89a] rounded-full transition-all duration-500"
                style={{ width: stats.total > 0 ? `${(Math.random() * 40 + 40)}%` : '0%' }}
              />
            </div>
            <span className="text-xs text-[#6b6b6b] w-8">{Math.floor(stats.total * 0.3)}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#2a2a2e]" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-[#2a2a2e] rounded" />
                <div className="h-3 w-16 bg-[#2a2a2e] rounded" />
              </div>
            </div>
            <div className="h-4 w-full bg-[#2a2a2e] rounded mb-2" />
            <div className="h-4 w-3/4 bg-[#2a2a2e] rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="grid md:grid-cols-2 gap-8 p-6 bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="font-display text-6xl text-[#c9b89a] mb-2">
            {stats.average > 0 ? stats.average.toFixed(1) : '0.0'}
          </div>
          <StarRating rating={Math.round(stats.average)} size="lg" />
          <p className="text-sm text-[#6b6b6b] mt-2">
            Based on {stats.total} review{stats.total !== 1 ? 's' : ''}
          </p>
        </div>
        <div>{renderRatingBars()}</div>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review, index) => (
              <ReviewCard key={review.id} review={review} index={index} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-full bg-[#1a1a1e] border border-[#2a2a2e] text-[#a8a4a0] hover:border-[#c9b89a]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-[#6b6b6b]">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-full bg-[#1a1a1e] border border-[#2a2a2e] text-[#a8a4a0] hover:border-[#c9b89a]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl">
          <p className="text-[#6b6b6b]">No reviews yet. Be the first to review this product!</p>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishlist, removeFromWishlistAPI, selectWishlistItems } from '../../store/slices/wishlistSlice';
import { addItem } from '../../store/slices/cartSlice';
import { formatPrice } from '../../utils/formatPrice';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const token = useSelector((state) => state.auth.token);

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
    if (token) {
      dispatch(removeFromWishlistAPI(id));
    }
  };

  const handleAddToCart = (item) => {
    dispatch(addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    }));
    handleRemove(item.id);
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] pt-20">
      {/* Header */}
      <div className="max-w-350 mx-auto px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl text-[#f8f4ef]">My Wishlist</h1>
            <p className="text-[#6b6b6b] mt-2">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
            </p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-2 text-[#c9b89a] hover:text-[#d4c9a8] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        {wishlistItems.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-[#1a1a1e] flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-[#c9b89a]/30" />
            </div>
            <h2 className="font-display text-2xl text-[#f8f4ef] mb-3">Your wishlist is empty</h2>
            <p className="text-[#6b6b6b] max-w-md mb-8">
              Start adding items you love to your wishlist and they'll appear here.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9b89a] text-[#0c0c0e] font-medium rounded-full hover:bg-[#d4c9a8] transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              Browse Products
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#c9b89a]/20"
              >
                {/* Image */}
                <div className="relative aspect-3/4 bg-[#0c0c0e] overflow-hidden">
                  <img
                    src={item.image || 'https://picsum.photos/400/500'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0c0c0e] via-transparent to-transparent opacity-60" />

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-4 right-4 p-2 bg-[#0c0c0e]/80 backdrop-blur-md rounded-full text-[#f8f4ef]/70 hover:text-red-400 hover:bg-[#0c0c0e] transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="absolute bottom-4 left-4 right-4 py-3 bg-[#c9b89a] text-[#0c0c0e] font-medium rounded-full hover:bg-[#d4c9a8] transition-all flex items-center justify-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-[#f8f4ef] font-medium mb-2 line-clamp-2 group-hover:text-[#c9b89a] transition-colors">
                    {item.name}
                  </h3>
                  <span className="font-display text-xl text-[#c9b89a]">
                    {formatPrice(item.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
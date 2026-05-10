import { Link } from 'react-router-dom';
import { Plus, Heart, Eye } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist, selectIsInWishlist } from '../../store/slices/wishlistSlice';
import { formatPrice } from '../../utils/formatPrice';
import Badge from '../ui/Badge';

const ProductCard = ({ product, index = 0 }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const productId = product._id || product.id;
  const isWishlisted = useSelector(selectIsInWishlist(productId));

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addItem({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image,
      quantity: 1,
    }));
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      dispatch(removeFromWishlist(productId));
    } else {
      dispatch(addToWishlist({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image,
      }));
    }
  };

  const getStockStatus = () => {
    if (product.stock === 0) return { label: 'Out of Stock', variant: 'error' };
    if (product.stock <= 5) return { label: `Only ${product.stock} left`, variant: 'warning' };
    return { label: 'In Stock', variant: 'success' };
  };

  const stockStatus = getStockStatus();
  const imageUrl = product.images?.[0] || product.image || 'https://picsum.photos/400/400';

  return (
    <Link
      to={`/products/${productId}`}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Card Container */}
      <div className="relative bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#c9b89a]/5 hover:border-[#c9b89a]/20">
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-[#0c0c0e] overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent opacity-60" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <Badge
              variant={stockStatus.variant}
              className="backdrop-blur-md bg-[#0c0c0e]/80 border-0"
            >
              {stockStatus.label}
            </Badge>
            <button
              onClick={handleWishlist}
              className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
                isWishlisted
                  ? 'bg-[#c9b89a] text-[#0c0c0e]'
                  : 'bg-[#0c0c0e]/60 text-[#f8f4ef]/70 hover:bg-[#0c0c0e]/80'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Quick Actions */}
          <div className={`absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-500 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#c9b89a] text-[#0c0c0e] font-medium rounded-full hover:bg-[#d4c9a8] transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn"
            >
              <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform" />
              <span>Add to Cart</span>
            </button>
            <button className="p-3 bg-[#1a1a1e] backdrop-blur-md border border-[#2a2a2e] rounded-full hover:border-[#c9b89a]/50 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-[#c9b89a] text-xs tracking-[0.2em] uppercase mb-2 opacity-70">
            {product.category?.name || product.category || 'Collection'}
          </p>
          <h3 className="text-[#f8f4ef] font-medium leading-snug line-clamp-2 mb-3 group-hover:text-[#c9b89a] transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="font-display text-xl text-[#c9b89a]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-[#6b6b6b] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Decorative Corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#c9b89a]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </Link>
  );
};

export default ProductCard;
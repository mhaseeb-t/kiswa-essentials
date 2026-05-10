import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Sparkles } from 'lucide-react';
import { removeItem, updateQuantity, selectCartTotal } from '../../store/slices/cartSlice';
import { formatPrice } from '../../utils/formatPrice';
import { FREE_SHIPPING_THRESHOLD } from '../../utils/constants';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const total = useSelector(selectCartTotal);
  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : 4.99;
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] pt-20 flex items-center justify-center px-6">
        <div className="text-center max-w-md animate-fadeInUp">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#1a1a1e] border border-[#2a2a2e] mb-8">
            <ShoppingBag className="w-10 h-10 text-[#6b6b6b]" />
          </div>
          <h2 className="font-display text-3xl text-[#f8f4ef] mb-4">Your Cart is Empty</h2>
          <p className="text-[#6b6b6b] mb-8 leading-relaxed">
            Looks like you haven't added anything to your cart yet.
            Discover our curated collection of premium South Asian fashion.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#c9b89a] text-[#0c0c0e] font-medium rounded-full hover:bg-[#d4c9a8] transition-all group"
          >
            Shop Now
            <Sparkles className="w-4 h-4 group-hover:rotate-45 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0e] pt-20 pb-16">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-[#c9b89a] text-xs tracking-[0.3em] uppercase mb-2 block">Review</span>
            <h1 className="font-display text-4xl text-[#f8f4ef]">Your Cart</h1>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-[#a8a4a0] hover:text-[#c9b89a] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="group flex gap-6 p-5 bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl transition-all duration-300 hover:border-[#c9b89a]/20 animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="w-28 h-36 sm:w-32 sm:h-40 bg-[#0c0c0e] rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={item.image || `https://picsum.photos/128/160?random=${item.id}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 className="text-[#f8f4ef] font-medium leading-snug mb-2 group-hover:text-[#c9b89a] transition-colors">
                      {item.name}
                    </h3>
                    <p className="font-display text-lg text-[#c9b89a]">{formatPrice(item.price)}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-[#0c0c0e] border border-[#2a2a2e] rounded-full">
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                          className="p-2.5 text-[#a8a4a0] hover:text-[#f8f4ef] hover:bg-[#1a1a1e] rounded-full transition-all"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 text-[#f8f4ef] font-medium min-w-[2rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                          className="p-2.5 text-[#a8a4a0] hover:text-[#f8f4ef] hover:bg-[#1a1a1e] rounded-full transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => dispatch(removeItem(item.id))}
                        className="p-2.5 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <p className="font-display text-xl text-[#f8f4ef]">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-6 lg:p-8 sticky top-24">
              <h2 className="font-display text-xl text-[#f8f4ef] mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-[#6b6b6b]">Subtotal</span>
                  <span className="text-[#f8f4ef]">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b6b6b]">Shipping</span>
                  <span className={shipping === 0 ? 'text-[#4caf50]' : 'text-[#f8f4ef]'}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="pt-4 border-t border-[#2a2a2e] flex justify-between">
                  <span className="text-[#f8f4ef] font-medium">Total</span>
                  <span className="font-display text-2xl text-[#c9b89a]">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {total < FREE_SHIPPING_THRESHOLD && (
                <div className="bg-[#c9b89a]/10 border border-[#c9b89a]/20 rounded-xl p-4 mb-6">
                  <p className="text-sm text-[#a8a4a0] text-center">
                    Add <span className="text-[#c9b89a] font-medium">{formatPrice(FREE_SHIPPING_THRESHOLD - total)}</span> more for free shipping
                  </p>
                  <div className="mt-2 h-1.5 bg-[#2a2a2e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#c9b89a] to-[#d4c9a8] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-[#c9b89a] text-[#0c0c0e] font-medium rounded-full hover:bg-[#d4c9a8] transition-all flex items-center justify-center gap-2 group"
              >
                Proceed to Checkout
                <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-xs text-[#6b6b6b] text-center mt-4">
                Taxes calculated at checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
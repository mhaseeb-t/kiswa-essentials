import { useSelector, useDispatch } from 'react-redux';
import { X, Plus, Minus, Trash2, ShoppingBag, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { removeItem, updateQuantity, toggleCart, selectCartTotal } from '../../store/slices/cartSlice';
import { formatPrice } from '../../utils/formatPrice';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const { items, isOpen } = useSelector((state) => state.cart);
  const total = useSelector(selectCartTotal);
  const currency = useSelector((state) => state.settings.currency);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn"
        onClick={() => dispatch(toggleCart())}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[#1a1a1e] border-l border-[#2a2a2e] shadow-2xl flex flex-col animate-slideInRight">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2a2a2e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#c9b89a]/20 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-[#c9b89a]" />
            </div>
            <div>
              <h2 className="text-lg font-display text-[#f8f4ef]">Your Cart</h2>
              <p className="text-xs text-[#6b6b6b]">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(toggleCart())}
            className="p-2.5 text-[#6b6b6b] hover:text-[#f8f4ef] hover:bg-[#2a2a2e] rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-[#2a2a2e] flex items-center justify-center mb-6">
              <ShoppingBag className="w-8 h-8 text-[#6b6b6b]" />
            </div>
            <h3 className="font-display text-xl text-[#f8f4ef] mb-2">Your cart is empty</h3>
            <p className="text-[#6b6b6b] mb-8 text-sm">Add some products to get started</p>
            <Link
              to="/products"
              onClick={() => dispatch(toggleCart())}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9b89a] text-[#0c0c0e] font-medium rounded-full hover:bg-[#d4c9a8] transition-all group"
            >
              Browse Products
              <Sparkles className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="group flex gap-4 p-4 bg-[#0c0c0e] rounded-xl border border-[#2a2a2e] hover:border-[#c9b89a]/30 transition-all animate-fadeInUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-20 h-24 bg-[#1a1a1e] rounded-lg overflow-hidden shrink-0">
                    <img
                      src={item.image || `https://picsum.photos/80/96?random=${item.id}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="text-[#f8f4ef] text-sm font-medium truncate group-hover:text-[#c9b89a] transition-colors">
                        {item.name}
                      </h4>
                      <p className="font-display text-[#c9b89a] mt-1">{formatPrice(item.price, currency)}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-[#1a1a1e] border border-[#2a2a2e] rounded-full">
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                          className="p-1.5 text-[#a8a4a0] hover:text-[#f8f4ef] hover:bg-[#2a2a2e] rounded-full transition-all"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-[#f8f4ef] text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                          className="p-1.5 text-[#a8a4a0] hover:text-[#f8f4ef] hover:bg-[#2a2a2e] rounded-full transition-all"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => dispatch(removeItem(item.id))}
                        className="p-1.5 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#2a2a2e] bg-[#0c0c0e]">
              {/* Total */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#6b6b6b]">Subtotal</span>
                <span className="font-display text-2xl text-[#c9b89a]">{formatPrice(total, currency)}</span>
              </div>

              <p className="text-xs text-[#6b6b6b] mb-6 text-center">Shipping & taxes calculated at checkout</p>

              {/* Actions */}
              <Link
                to="/checkout"
                onClick={() => dispatch(toggleCart())}
                className="block mb-3"
              >
                <button className="w-full py-4 bg-[#c9b89a] text-[#0c0c0e] font-medium rounded-full hover:bg-[#d4c9a8] transition-all flex items-center justify-center gap-2 group">
                  Checkout
                  <X className="w-4 h-4 rotate-45 group-hover:rotate-0 transition-transform" />
                </button>
              </Link>

              <Link
                to="/cart"
                onClick={() => dispatch(toggleCart())}
                className="block text-center text-[#a8a4a0] hover:text-[#c9b89a] text-sm transition-colors py-2"
              >
                View Full Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
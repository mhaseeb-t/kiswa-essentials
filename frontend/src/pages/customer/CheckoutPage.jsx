import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { Lock, CreditCard, ChevronRight, ChevronLeft, Check, Tag, X } from 'lucide-react';
import { clearCart } from '../../store/slices/cartSlice';
import { formatPrice } from '../../utils/formatPrice';
import { FREE_SHIPPING_THRESHOLD } from '../../utils/constants';
import api from '../../api/axios';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      postcode: '',
      country: 'UK',
    }
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : 4.99;
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = total + shipping - discount;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    setCouponLoading(true);

    try {
      const response = await api.post('/coupons/validate', {
        code: couponCode.trim(),
        subtotal: total
      });

      if (response.data.success) {
        setAppliedCoupon(response.data.data);
        setCouponCode('');
      }
    } catch (error) {
      setCouponError(error.response?.data?.message || 'Failed to apply coupon');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const onSubmit = async (data) => {
    if (step === 1) {
      setStep(2);
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    dispatch(clearCart());
    navigate('/order-confirm', { state: { orderId: 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase() } });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="font-display text-2xl text-[#f8f4ef] mb-4">Your cart is empty</h2>
          <Link to="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0e] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center">
            <div className={`flex items-center ${step >= 1 ? 'text-[#c9b89a]' : 'text-[#6b6b6b]'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-[#c9b89a] text-[#0c0c0e]' : 'border-2 border-[#2a2a2e]'}`}>
                {step > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <span className="ml-2 text-sm">Details</span>
            </div>
            <div className={`w-20 h-0.5 mx-4 ${step >= 2 ? 'bg-[#c9b89a]' : 'bg-[#2a2a2e]'}`} />
            <div className={`flex items-center ${step >= 2 ? 'text-[#c9b89a]' : 'text-[#6b6b6b]'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-[#c9b89a] text-[#0c0c0e]' : 'border-2 border-[#2a2a2e]'}`}>
                {step > 2 ? <Check className="w-4 h-4" /> : '2'}
              </div>
              <span className="ml-2 text-sm">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-6">
              {step === 1 && (
                <>
                  <h2 className="font-display text-xl text-[#f8f4ef] mb-6">Delivery Details</h2>
                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      placeholder="Enter your full name"
                      {...register('fullName', { required: 'Full name is required' })}
                      error={errors.fullName?.message}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Email"
                        type="email"
                        placeholder="your@email.com"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                        })}
                        error={errors.email?.message}
                      />
                      <Input
                        label="Phone"
                        type="tel"
                        placeholder="+44 1234 567890"
                        {...register('phone', { required: 'Phone is required' })}
                        error={errors.phone?.message}
                      />
                    </div>
                    <Input
                      label="Address Line 1"
                      placeholder="Street address"
                      {...register('line1', { required: 'Address is required' })}
                      error={errors.line1?.message}
                    />
                    <Input
                      label="Address Line 2"
                      placeholder="Apartment, suite, etc. (optional)"
                      {...register('line2')}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="City"
                        placeholder="London"
                        {...register('city', { required: 'City is required' })}
                        error={errors.city?.message}
                      />
                      <Input
                        label="Postcode"
                        placeholder="EC1A 1BB"
                        {...register('postcode', { required: 'Postcode is required' })}
                        error={errors.postcode?.message}
                      />
                    </div>
                    <Input
                      label="Country"
                      placeholder="United Kingdom"
                      {...register('country')}
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="font-display text-xl text-[#f8f4ef] mb-6">Payment</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[#6b6b6b] text-sm mb-2 block">Card Details</label>
                      <div className="bg-[#0c0c0e] border border-[#2a2a2e] rounded-xl p-4 flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-[#6b6b6b]" />
                        <span className="text-[#6b6b6b]">Stripe Card Element Placeholder</span>
                      </div>
                    </div>
                    <div className="bg-[#0c0c0e] rounded-xl p-4 flex items-center gap-2 text-[#6b6b6b] text-sm">
                      <Lock className="w-4 h-4" />
                      <span>Secured by Stripe</span>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-4 mt-8">
                {step === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                <Button type="submit" className="flex-1" isLoading={isProcessing}>
                  {step === 1 ? (
                    <>
                      Continue
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Pay {formatPrice(grandTotal)}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-6 sticky top-24">
              <h3 className="font-display text-lg text-[#f8f4ef] mb-4">Order Summary</h3>

              {/* Promo Code Input */}
              {!appliedCoupon && (
                <div className="mb-4">
                  <label className="text-[#6b6b6b] text-sm mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 bg-[#0c0c0e] border border-[#2a2a2e] rounded-xl px-3 py-2 text-[#f8f4ef] text-sm placeholder:text-[#6b6b6b] focus:outline-none focus:border-[#c9b89a]"
                      onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                    />
                    <Button onClick={applyCoupon} isLoading={couponLoading} size="sm">
                      Apply
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-[#ef4444] text-xs mt-2">{couponError}</p>
                  )}
                </div>
              )}

              {/* Applied Coupon */}
              {appliedCoupon && (
                <div className="mb-4 p-3 bg-[#0c0c0e] border border-[#c9b89a]/30 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#c9b89a] text-sm font-medium">{appliedCoupon.code}</p>
                      <p className="text-[#6b6b6b] text-xs">
                        {appliedCoupon.discountType === 'percentage'
                          ? `${appliedCoupon.discountValue}% off`
                          : `${formatPrice(appliedCoupon.discountValue)} off`}
                      </p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[#6b6b6b] hover:text-[#ef4444] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 bg-[#0c0c0e] rounded-xl overflow-hidden shrink-0">
                      <img src={item.image || `https://picsum.photos/48/48?random=${item.id}`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#f8f4ef] text-sm truncate">{item.name}</p>
                      <p className="text-[#6b6b6b] text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-[#f8f4ef] text-sm">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#2a2a2e] pt-4 space-y-2">
                <div className="flex justify-between text-[#6b6b6b] text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-[#6b6b6b] text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-[#4caf50]">Free</span> : formatPrice(shipping)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-[#c9b89a] text-sm">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#f8f4ef] font-medium pt-2 border-t border-[#2a2a2e]">
                  <span>Total</span>
                  <span className="text-[#c9b89a]">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
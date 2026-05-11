import { useLocation, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button';

const OrderConfirmPage = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase();

  return (
    <div className="min-h-screen bg-[#0c0c0e] pt-20 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto animate-fadeInUp">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
        </div>

        <h1 className="font-display text-4xl text-[#f8f4ef] mb-4">Order Confirmed!</h1>
        <p className="text-[#6b6b6b] mb-2">Thank you for your purchase.</p>
        <p className="text-[#6b6b6b] mb-8">
          Your order has been placed successfully. You will receive a confirmation email shortly.
        </p>

        <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-6 mb-8">
          <p className="text-[#6b6b6b] text-xs uppercase tracking-wider mb-1">Order ID</p>
          <p className="font-display text-2xl text-[#c9b89a]">{orderId}</p>
        </div>

        <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-xl p-4 mb-8">
          <p className="text-[#6b6b6b] text-sm">
            <span className="text-[#f8f4ef]">Estimated delivery:</span> 5-7 business days
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/my-orders">
            <Button variant="outline">Track Order</Button>
          </Link>
          <Link to="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>

        <p className="text-[#6b6b6b] text-sm mt-8">
          Confirmation sent to your email
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmPage;
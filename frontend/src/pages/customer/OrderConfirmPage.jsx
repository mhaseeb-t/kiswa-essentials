import { useLocation, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button';

const OrderConfirmPage = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase();

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-[#4caf50] rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-medium text-[#f5f0e8] mb-4">Order Confirmed!</h1>
        <p className="text-[#888888] mb-2">Thank you for your purchase.</p>
        <p className="text-[#888888] mb-8">
          Your order has been placed successfully. You will receive a confirmation email shortly.
        </p>

        <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-6 mb-8">
          <p className="text-[#888888] text-sm mb-1">Order ID</p>
          <p className="text-[#c9b89a] text-2xl font-medium">{orderId}</p>
        </div>

        <div className="bg-[#0f0f0f] rounded-lg p-4 mb-8">
          <p className="text-[#888888] text-sm">
            <span className="text-[#f5f0e8]">Estimated delivery:</span> 5-7 business days
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

        <p className="text-[#888888] text-sm mt-8">
          Confirmation sent to your email
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmPage;
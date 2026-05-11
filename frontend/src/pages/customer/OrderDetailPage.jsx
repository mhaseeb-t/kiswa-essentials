import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import OrderStatusTracker from '../../components/order/OrderStatusTracker';
import Badge from '../../components/ui/Badge';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { ORDER_STATUSES } from '../../utils/constants';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const mockOrder = {
    id: id || 'ORD-847291',
    createdAt: '2024-01-15T10:30:00Z',
    status: 'SHIPPED',
    trackingNumber: 'DHL-1234567890',
    courier: 'DHL',
    total: 289.97,
    shippingCost: 0,
    shippingAddress: {
      fullName: 'Ahmed Khan',
      email: 'ahmed@example.com',
      phone: '+44 20 1234 5678',
      line1: '123 Example Street',
      line2: 'Flat 4B',
      city: 'London',
      postcode: 'EC1A 1BB',
      country: 'UK',
    },
    items: [
      { id: '1', name: 'Embroidered Kurta', price: 89.99, quantity: 2, image: 'https://picsum.photos/100/100?random=1' },
      { id: '2', name: 'Silk Embroidered Shawl', price: 59.99, quantity: 1, image: 'https://picsum.photos/100/100?random=2' },
    ],
  };

  useEffect(() => {
    setOrder(mockOrder);
  }, [id]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] pt-20 flex items-center justify-center">
        <p className="text-[#6b6b6b]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0e] pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <Link to="/my-orders" className="inline-flex items-center gap-2 text-[#a8a4a0] hover:text-[#c9b89a] mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Orders
        </Link>

        <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-2xl text-[#f8f4ef]">Order {order.id}</h1>
              <p className="text-[#6b6b6b] text-sm mt-1">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <Badge variant={order.status === 'DELIVERED' ? 'success' : 'info'}>
              {ORDER_STATUSES[order.status]?.label || order.status}
            </Badge>
          </div>

          <OrderStatusTracker currentStatus={order.status} />
        </div>

        {order.trackingNumber && (
          <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-6 mb-6">
            <h2 className="font-display text-lg text-[#f8f4ef] mb-4">Tracking Information</h2>
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <p className="text-[#6b6b6b] text-xs uppercase tracking-wider mb-1">Courier</p>
                <p className="text-[#f8f4ef]">{order.courier}</p>
              </div>
              <div>
                <p className="text-[#6b6b6b] text-xs uppercase tracking-wider mb-1">Tracking Number</p>
                <p className="text-[#c9b89a]">{order.trackingNumber}</p>
              </div>
              <a
                href={`https://www.dhl.com/en/express/tracking.html?AWB=${order.trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#c9b89a] hover:text-[#d4c9a8] transition-colors ml-auto"
              >
                Track on {order.courier}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-6 mb-6">
          <h2 className="font-display text-lg text-[#f8f4ef] mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-[#0c0c0e] rounded-xl">
                <div className="w-20 h-20 bg-[#2a2a2e] rounded-lg overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[#f8f4ef] font-medium">{item.name}</h3>
                  <p className="text-[#6b6b6b] text-sm mt-1">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#f8f4ef]">{formatPrice(item.price * item.quantity)}</p>
                  <p className="text-[#6b6b6b] text-sm">{formatPrice(item.price)} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-6">
            <h2 className="font-display text-lg text-[#f8f4ef] mb-4">Delivery Address</h2>
            <div className="text-[#6b6b6b] space-y-1">
              <p className="text-[#f8f4ef] font-medium">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.postcode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-6">
            <h2 className="font-display text-lg text-[#f8f4ef] mb-4">Price Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-[#6b6b6b]">
                <span>Subtotal</span>
                <span>{formatPrice(order.total - order.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-[#6b6b6b]">
                <span>Shipping</span>
                <span>{order.shippingCost === 0 ? <span className="text-green-400">Free</span> : formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-[#f8f4ef] font-medium pt-3 border-t border-[#2a2a2e]">
                <span>Total</span>
                <span className="text-[#c9b89a]">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
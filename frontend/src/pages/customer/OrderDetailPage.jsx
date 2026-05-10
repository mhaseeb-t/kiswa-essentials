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
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <p className="text-[#888888]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/my-orders" className="inline-flex items-center text-[#888888] hover:text-[#c9b89a] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Link>

        <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-medium text-[#f5f0e8]">Order {order.id}</h1>
              <p className="text-[#888888] text-sm mt-1">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <Badge variant={order.status === 'DELIVERED' ? 'success' : 'info'}>
              {ORDER_STATUSES[order.status]?.label || order.status}
            </Badge>
          </div>

          <OrderStatusTracker currentStatus={order.status} />
        </div>

        {order.trackingNumber && (
          <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-[#f5f0e8] mb-4">Tracking Information</h2>
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <p className="text-[#888888] text-sm">Courier</p>
                <p className="text-[#f5f0e8]">{order.courier}</p>
              </div>
              <div>
                <p className="text-[#888888] text-sm">Tracking Number</p>
                <p className="text-[#c9b89a]">{order.trackingNumber}</p>
              </div>
              <a
                href={`https://www.dhl.com/en/express/tracking.html?AWB=${order.trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#c9b89a] hover:underline ml-auto"
              >
                Track on {order.courier}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-[#f5f0e8] mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-[#0f0f0f] rounded">
                <div className="w-20 h-20 bg-[#2e2e2e] rounded overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[#f5f0e8] font-medium">{item.name}</h3>
                  <p className="text-[#888888] text-sm mt-1">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#f5f0e8]">{formatPrice(item.price * item.quantity)}</p>
                  <p className="text-[#888888] text-sm">{formatPrice(item.price)} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-6">
            <h2 className="text-lg font-medium text-[#f5f0e8] mb-4">Delivery Address</h2>
            <div className="text-[#888888] space-y-1">
              <p className="text-[#f5f0e8]">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.postcode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-6">
            <h2 className="text-lg font-medium text-[#f5f0e8] mb-4">Price Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-[#888888]">
                <span>Subtotal</span>
                <span>{formatPrice(order.total - order.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>Shipping</span>
                <span>{order.shippingCost === 0 ? <span className="text-[#4caf50]">Free</span> : formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-[#f5f0e8] font-medium pt-3 border-t border-[#2e2e2e]">
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
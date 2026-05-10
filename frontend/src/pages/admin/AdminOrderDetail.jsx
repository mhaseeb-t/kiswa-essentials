import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { ORDER_STATUSES } from '../../utils/constants';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courier, setCourier] = useState('');

  useEffect(() => {
    const mockOrder = {
      id: id || 'ORD-847291',
      customer: { name: 'Ahmed Khan', email: 'ahmed@example.com', phone: '+44 20 1234 5678' },
      createdAt: '2024-01-15T10:30:00Z',
      status: 'SHIPPED',
      total: 289.97,
      shippingCost: 0,
      items: [
        { id: '1', name: 'Embroidered Kurta', price: 89.99, quantity: 2, image: 'https://picsum.photos/80/80?random=1' },
        { id: '2', name: 'Silk Embroidered Shawl', price: 59.99, quantity: 1, image: 'https://picsum.photos/80/80?random=2' },
      ],
      shippingAddress: { fullName: 'Ahmed Khan', line1: '123 Example St', city: 'London', postcode: 'EC1A 1BB', country: 'UK' },
    };

    setOrder(mockOrder);
    setStatus(mockOrder.status);
    setTrackingNumber('DHL-1234567890');
    setCourier('DHL');
  }, [id]);

  const handleUpdate = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Order updated successfully! Customer will be notified.');
    navigate('/admin/orders');
  };

  if (!order) return <div className="min-h-screen bg-[#0f0f0f]">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/admin/orders')} className="inline-flex items-center text-[#888888] hover:text-[#c9b89a] mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </button>

        <h1 className="text-3xl font-medium text-[#f5f0e8] mb-8">Order {order.id}</h1>

        {/* Customer Info */}
        <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-[#f5f0e8] mb-4">Customer Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[#888888] text-sm">Name</p>
              <p className="text-[#f5f0e8]">{order.customer.name}</p>
            </div>
            <div>
              <p className="text-[#888888] text-sm">Email</p>
              <p className="text-[#f5f0e8]">{order.customer.email}</p>
            </div>
            <div>
              <p className="text-[#888888] text-sm">Phone</p>
              <p className="text-[#f5f0e8]">{order.customer.phone}</p>
            </div>
            <div>
              <p className="text-[#888888] text-sm">Date</p>
              <p className="text-[#f5f0e8]">{formatDate(order.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-[#f5f0e8] mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-[#0f0f0f] rounded">
                <div className="w-16 h-16 bg-[#2e2e2e] rounded overflow-hidden">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-[#f5f0e8]">{item.name}</p>
                  <p className="text-[#888888] text-sm">Qty: {item.quantity}</p>
                </div>
                <p className="text-[#f5f0e8]">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[#2e2e2e] flex justify-between">
            <span className="text-[#888888]">Total</span>
            <span className="text-[#c9b89a] text-xl">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Update Order */}
        <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-[#f5f0e8] mb-4">Update Order</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[#888888] text-sm mb-2 block">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2e2e2e] rounded text-[#f5f0e8] focus:outline-none focus:border-[#c9b89a]"
              >
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Courier"
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                placeholder="DHL, FedEx, etc."
              />
              <Input
                label="Tracking Number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="TRK-XXXXX"
              />
            </div>
            <p className="text-[#888888] text-sm">Customer will be emailed on update.</p>
            <Button onClick={handleUpdate} className="w-full">
              Update Order
            </Button>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-6">
          <h2 className="text-lg font-medium text-[#f5f0e8] mb-4">Delivery Address</h2>
          <div className="text-[#888888]">
            <p className="text-[#f5f0e8]">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.line1}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.postcode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
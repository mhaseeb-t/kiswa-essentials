import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { ORDER_STATUSES } from '../../utils/constants';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  const mockOrders = [
    { id: 'ORD-847291', createdAt: '2024-01-15', items: 3, total: 289.97, status: 'DELIVERED' },
    { id: 'ORD-729384', createdAt: '2024-01-10', items: 1, total: 89.99, status: 'SHIPPED' },
    { id: 'ORD-618273', createdAt: '2024-01-05', items: 2, total: 159.98, status: 'PAID' },
    { id: 'ORD-509162', createdAt: '2024-01-01', items: 1, total: 129.99, status: 'PENDING' },
  ];

  useEffect(() => {
    setOrders(mockOrders);
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0c0e] pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-[#f8f4ef]">My Orders</h1>
          <p className="text-[#6b6b6b] mt-1">Track your order history and status</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl">
            <p className="text-[#6b6b6b] mb-4">You haven't placed any orders yet.</p>
            <Link to="/products" className="text-[#c9b89a] hover:text-[#d4c9a8] transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a2e]">
                  <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Order ID</th>
                  <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Date</th>
                  <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Items</th>
                  <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Total</th>
                  <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-[#2a2a2e]/50 hover:bg-[#0c0c0e]/30 transition-colors">
                    <td className="p-4">
                      <span className="text-sm font-medium text-[#c9b89a]">{order.id}</span>
                    </td>
                    <td className="p-4 text-sm text-[#6b6b6b]">{formatDate(order.createdAt)}</td>
                    <td className="p-4 text-sm text-[#6b6b6b]">{order.items} items</td>
                    <td className="p-4">
                      <span className="font-display text-[#f8f4ef]">{formatPrice(order.total)}</span>
                    </td>
                    <td className="p-4">
                      <Badge variant={
                        order.status === 'DELIVERED' ? 'success' :
                        order.status === 'CANCELLED' ? 'error' :
                        order.status === 'SHIPPED' ? 'info' :
                        order.status === 'PAID' ? 'default' : 'warning'
                      }>
                        {ORDER_STATUSES[order.status]?.label || order.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Link
                        to={`/my-orders/${order.id}`}
                        className="inline-flex items-center gap-2 text-sm text-[#c9b89a] hover:text-[#d4c9a8] transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
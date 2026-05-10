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
    <div className="min-h-screen bg-[#0f0f0f] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-medium text-[#f5f0e8] mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg">
            <p className="text-[#888888] mb-4">You haven't placed any orders yet.</p>
            <Link to="/products">
              <button className="text-[#c9b89a] hover:underline">Start Shopping</button>
            </Link>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2e2e2e]">
                  <th className="text-left p-4 text-[#888888] text-sm font-medium">Order ID</th>
                  <th className="text-left p-4 text-[#888888] text-sm font-medium">Date</th>
                  <th className="text-left p-4 text-[#888888] text-sm font-medium">Items</th>
                  <th className="text-left p-4 text-[#888888] text-sm font-medium">Total</th>
                  <th className="text-left p-4 text-[#888888] text-sm font-medium">Status</th>
                  <th className="text-left p-4 text-[#888888] text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-[#2e2e2e] hover:bg-[#0f0f0f] transition-colors">
                    <td className="p-4 text-[#f5f0e8] font-medium">{order.id}</td>
                    <td className="p-4 text-[#888888]">{formatDate(order.createdAt)}</td>
                    <td className="p-4 text-[#888888]">{order.items} items</td>
                    <td className="p-4 text-[#c9b89a]">{formatPrice(order.total)}</td>
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
                        className="inline-flex items-center gap-2 text-[#c9b89a] hover:underline"
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
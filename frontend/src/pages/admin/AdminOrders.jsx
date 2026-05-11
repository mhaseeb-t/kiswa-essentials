import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import { formatPrice } from '../../utils/formatPrice';
import { ORDER_STATUSES } from '../../utils/constants';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    setOrders([
      { id: 'ORD-847291', customer: 'Ahmed Khan', email: 'ahmed@example.com', total: 289.97, status: 'PENDING', date: '2024-01-15' },
      { id: 'ORD-729384', customer: 'Fatima Ahmed', email: 'fatima@example.com', total: 179.98, status: 'SHIPPED', date: '2024-01-14' },
      { id: 'ORD-618273', customer: 'Omar Ali', email: 'omar@example.com', total: 89.99, status: 'PAID', date: '2024-01-13' },
      { id: 'ORD-509162', customer: 'Sara Khan', email: 'sara@example.com', total: 149.99, status: 'DELIVERED', date: '2024-01-12' },
      { id: 'ORD-400351', customer: 'Usman Ali', email: 'usman@example.com', total: 199.99, status: 'CANCELLED', date: '2024-01-11' },
    ]);
  }, []);

  const tabs = ['all', 'PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(o => o.status === activeTab);

  return (
    <div className="min-h-screen bg-[#0c0c0e] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-[#f8f4ef]">Orders</h1>
          <p className="text-[#6b6b6b] mt-1">Manage and track all customer orders</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-[#c9b89a] text-[#0c0c0e]'
                  : 'bg-[#1a1a1e] text-[#6b6b6b] border border-[#2a2a2e] hover:border-[#c9b89a]/50 hover:text-[#f8f4ef]'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2e]">
                <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Order ID</th>
                <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Customer</th>
                <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Email</th>
                <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Total</th>
                <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Date</th>
                <th className="text-left p-4 text-[#6b6b6b] text-xs font-medium uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-[#2a2a2e]/50 hover:bg-[#0c0c0e]/30 transition-colors">
                  <td className="p-4">
                    <span className="text-sm font-medium text-[#c9b89a]">{order.id}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#c9b89a] to-[#a89878] flex items-center justify-center">
                        <span className="text-[#0c0c0e] text-xs font-medium">
                          {order.customer.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-sm text-[#f8f4ef]">{order.customer}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[#6b6b6b]">{order.email}</td>
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
                  <td className="p-4 text-sm text-[#6b6b6b]">{order.date}</td>
                  <td className="p-4">
                    <Link
                      to={`/admin/orders/${order.id}`}
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
      </div>
    </div>
  );
};

export default AdminOrders;
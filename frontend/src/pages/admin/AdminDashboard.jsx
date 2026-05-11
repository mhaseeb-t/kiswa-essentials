import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Package, Users, Plus, Eye, TrendingUp, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import Badge from '../../components/ui/Badge';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    revenue: 12450.00,
    orders: 47,
    products: 86,
    customers: 123,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setRecentOrders([
        { id: 'ORD-847291', customer: 'Ahmed Khan', total: 289.97, status: 'PENDING', date: '2024-01-15' },
        { id: 'ORD-729384', customer: 'Fatima Ahmed', total: 179.98, status: 'SHIPPED', date: '2024-01-14' },
        { id: 'ORD-618273', customer: 'Omar Ali', total: 89.99, status: 'PAID', date: '2024-01-13' },
        { id: 'ORD-509162', customer: 'Sara Khan', total: 149.99, status: 'DELIVERED', date: '2024-01-12' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const statCards = [
    { label: 'Total Revenue', value: formatPrice(stats.revenue), icon: DollarSign, color: '#c9b89a', trend: '+12.5%' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: '#10b981', trend: '+8.3%' },
    { label: 'Products', value: stats.products, icon: Package, color: '#6366f1', trend: '+4' },
    { label: 'Customers', value: stats.customers, icon: Users, color: '#ec4899', trend: '+15' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-400' };
      case 'PAID': return { bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-400' };
      case 'SHIPPED': return { bg: 'bg-purple-500/20', text: 'text-purple-400', dot: 'bg-purple-400' };
      case 'DELIVERED': return { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-400' };
      default: return { bg: 'bg-gray-500/20', text: 'text-gray-400', dot: 'bg-gray-400' };
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] pt-20 pb-16">
      <div className="max-w-350 mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-[#c9b89a]" />
              <span className="text-[#c9b89a] text-xs tracking-[0.3em] uppercase">Dashboard</span>
            </div>
            <h1 className="font-display text-4xl text-[#f8f4ef]">Welcome Back</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1e] border border-[#2a2a2e] rounded-full">
              <Clock className="w-4 h-4 text-[#6b6b6b]" />
              <span className="text-sm text-[#a8a4a0]">Last updated: Just now</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <div
              key={stat.label}
              className="relative bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-6 overflow-hidden group animate-fadeInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl" style={{ backgroundColor: stat.color }} />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                    <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </div>
                </div>

                <p className="text-3xl font-display text-[#f8f4ef] mb-1">{stat.value}</p>
                <p className="text-sm text-[#6b6b6b]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-12 animate-fadeInUp delay-200">
          <Link
            to="/admin/products/add"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9b89a] text-[#0c0c0e] font-medium rounded-full hover:bg-[#d4c9a8] transition-all group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            Add Product
          </Link>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#2a2a2e] text-[#f8f4ef] font-medium rounded-full hover:border-[#c9b89a]/50 hover:bg-[#1a1a1e]/50 transition-all"
          >
            <Eye className="w-4 h-4" />
            View All Orders
          </Link>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#2a2a2e] text-[#a8a4a0] rounded-full hover:border-[#c9b89a]/50 hover:text-[#f8f4ef] transition-all"
          >
            Manage Products
          </Link>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl overflow-hidden animate-fadeInUp delay-300">
          <div className="p-6 border-b border-[#2a2a2e] flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl text-[#f8f4ef]">Recent Orders</h2>
              <p className="text-sm text-[#6b6b6b] mt-1">Latest transactions across your store</p>
            </div>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-2 text-[#c9b89a] hover:text-[#d4c9a8] transition-colors group text-sm"
            >
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="w-10 h-10 border-2 border-[#c9b89a]/30 border-t-[#c9b89a] rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2a2e]">
                    <th className="text-left p-4 text-xs font-medium text-[#6b6b6b] uppercase tracking-wider">Order ID</th>
                    <th className="text-left p-4 text-xs font-medium text-[#6b6b6b] uppercase tracking-wider">Customer</th>
                    <th className="text-left p-4 text-xs font-medium text-[#6b6b6b] uppercase tracking-wider">Amount</th>
                    <th className="text-left p-4 text-xs font-medium text-[#6b6b6b] uppercase tracking-wider">Status</th>
                    <th className="text-left p-4 text-xs font-medium text-[#6b6b6b] uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => {
                    const statusColors = getStatusColor(order.status);
                    return (
                      <tr
                        key={order.id}
                        className="border-b border-[#2a2a2e]/50 hover:bg-[#0c0c0e]/30 transition-colors animate-fadeIn"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
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
                        <td className="p-4">
                          <span className="font-display text-[#f8f4ef]">{formatPrice(order.total)}</span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusColors.dot}`} />
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-[#6b6b6b]">{order.date}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Link
            to="/admin/categories"
            className="group bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-6 hover:border-[#c9b89a]/30 transition-all"
          >
            <h3 className="font-display text-lg text-[#f8f4ef] mb-2 group-hover:text-[#c9b89a] transition-colors">Manage Categories</h3>
            <p className="text-sm text-[#6b6b6b] mb-4">Add, edit or remove product categories</p>
            <span className="text-[#c9b89a] text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Manage <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            to="/admin/customers"
            className="group bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-6 hover:border-[#c9b89a]/30 transition-all"
          >
            <h3 className="font-display text-lg text-[#f8f4ef] mb-2 group-hover:text-[#c9b89a] transition-colors">View Customers</h3>
            <p className="text-sm text-[#6b6b6b] mb-4">Browse and manage customer accounts</p>
            <span className="text-[#c9b89a] text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Browse <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            to="/admin/inventory"
            className="group bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-6 hover:border-[#c9b89a]/30 transition-all"
          >
            <h3 className="font-display text-lg text-[#f8f4ef] mb-2 group-hover:text-[#c9b89a] transition-colors">Stock Management</h3>
            <p className="text-sm text-[#6b6b6b] mb-4">Monitor and update product inventory</p>
            <span className="text-[#c9b89a] text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Manage <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <div className="bg-linear-to-br from-[#c9b89a]/20 to-[#1a1a1e] border border-[#c9b89a]/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#c9b89a]/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#c9b89a]" />
              </div>
              <span className="text-sm text-[#c9b89a]">Pro Tip</span>
            </div>
            <p className="text-sm text-[#a8a4a0] leading-relaxed">
              Use batch operations to update multiple products at once. Save time on repetitive tasks!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
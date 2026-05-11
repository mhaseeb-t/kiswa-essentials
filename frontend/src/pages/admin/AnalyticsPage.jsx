import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingCart, Package, TrendingUp, TrendingDown, ArrowLeft, BarChart3 } from 'lucide-react';
import api from '../../api/axios';
import { formatPrice } from '../../utils/formatPrice';

const StatCard = ({ title, value, change, icon: Icon, accentColor }) => (
  <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-6">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-[#6b6b6b] text-sm">{title}</p>
        <p className="font-display text-3xl text-[#f8f4ef] mt-1">{value}</p>
      </div>
      <div className="w-12 h-12 rounded-xl bg-[#c9b89a]/10 flex items-center justify-center">
        <Icon className="w-5 h-5" style={{ color: accentColor || '#c9b89a' }} />
      </div>
    </div>
    {change !== undefined && (
      <div className="flex items-center gap-1">
        {change >= 0 ? (
          <TrendingUp className="w-4 h-4 text-green-400" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-400" />
        )}
        <p className={change >= 0 ? 'text-green-400 text-sm' : 'text-red-400 text-sm'}>
          {change >= 0 ? '+' : ''}{change}% vs last month
        </p>
      </div>
    )}
  </div>
);

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-400' };
    case 'PAID': return { bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-400' };
    case 'SHIPPED': return { bg: 'bg-purple-500/20', text: 'text-purple-400', dot: 'bg-purple-400' };
    case 'DELIVERED': return { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-400' };
    case 'CANCELLED': return { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-400' };
    default: return { bg: 'bg-gray-500/20', text: 'text-gray-400', dot: 'bg-gray-400' };
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const SimpleBarChart = ({ data }) => {
  const maxRevenue = Math.max(...data.map(d => parseFloat(d.revenue)), 1);
  const last7Days = data.slice(-7);

  return (
    <div className="flex items-end gap-3 h-48">
      {last7Days.map((day, index) => {
        const height = (parseFloat(day.revenue) / maxRevenue) * 100;
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex items-end justify-center h-36">
              <div
                className="w-full max-w-12 rounded-t-md bg-linear-to-t from-[#c9b89a] to-[#d4c9a8] transition-all duration-500"
                style={{ height: `${Math.max(height, 5)}%` }}
              />
            </div>
            <span className="text-xs text-[#6b6b6b]">
              {new Date(day.date).toLocaleDateString('en-GB', { weekday: 'short' })}
            </span>
            <span className="text-xs text-[#a8a4a0]">£{parseFloat(day.revenue).toFixed(0)}</span>
          </div>
        );
      })}
    </div>
  );
};

const AnalyticsPage = () => {
  const [overview, setOverview] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [overviewRes, ordersRes, productsRes, salesRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/recent-orders'),
          api.get('/analytics/top-products'),
          api.get('/analytics/sales-chart')
        ]);

        if (overviewRes.data.success) setOverview(overviewRes.data.data);
        if (ordersRes.data.success) setRecentOrders(ordersRes.data.orders);
        if (productsRes.data.success) setTopProducts(productsRes.data.products);
        if (salesRes.data.success) setSalesData(salesRes.data.sales);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const avgOrderValue = overview?.total_orders > 0
    ? overview.total_revenue / overview.total_orders
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] pt-20 pb-16">
        <div className="max-w-350 mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-2 border-[#c9b89a]/30 border-t-[#c9b89a] rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0e] pt-20 pb-16">
      <div className="max-w-350 mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/admin"
            className="w-10 h-10 rounded-xl bg-[#1a1a1e] border border-[#2a2a2e] flex items-center justify-center hover:border-[#c9b89a]/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#a8a4a0]" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-[#c9b89a]" />
              <span className="text-[#c9b89a] text-xs tracking-[0.3em] uppercase">Analytics</span>
            </div>
            <h1 className="font-display text-4xl text-[#f8f4ef]">Sales Dashboard</h1>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={formatPrice(overview?.total_revenue || 0)}
            change={12.5}
            icon={DollarSign}
            accentColor="#c9b89a"
          />
          <StatCard
            title="Total Orders"
            value={overview?.total_orders || 0}
            change={8.3}
            icon={ShoppingCart}
            accentColor="#10b981"
          />
          <StatCard
            title="Avg Order Value"
            value={formatPrice(avgOrderValue)}
            change={3.2}
            icon={Package}
            accentColor="#6366f1"
          />
          <StatCard
            title="Today's Revenue"
            value={formatPrice(overview?.revenue_today || 0)}
            icon={TrendingUp}
            accentColor="#ec4899"
          />
        </div>

        {/* Sales Chart */}
        <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl text-[#f8f4ef]">Sales Trend</h2>
              <p className="text-sm text-[#6b6b6b] mt-1">Last 7 days revenue</p>
            </div>
          </div>
          {salesData.length > 0 ? (
            <SimpleBarChart data={salesData} />
          ) : (
            <div className="h-48 flex items-center justify-center text-[#6b6b6b]">
              No sales data available
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-[#2a2a2e]">
              <h2 className="font-display text-xl text-[#f8f4ef]">Recent Orders</h2>
              <p className="text-sm text-[#6b6b6b] mt-1">Latest transactions</p>
            </div>
            <div className="divide-y divide-[#2a2a2e]/50">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => {
                  const statusColors = getStatusColor(order.status);
                  return (
                    <div key={order.id} className="p-4 hover:bg-[#0c0c0e]/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#c9b89a] to-[#a89878] flex items-center justify-center">
                            <span className="text-[#0c0c0e] text-sm font-medium">
                              {order.customer_name ? order.customer_name.split(' ').map(n => n[0]).join('').slice(0, 2) : '??'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#f8f4ef]">{order.customer_name || 'Guest'}</p>
                            <p className="text-xs text-[#6b6b6b]">#{order.id?.slice(-8) || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-[#f8f4ef]">{formatPrice(order.total)}</p>
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusColors.dot}`} />
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[#6b6b6b] mt-2">{formatDate(order.created_at)}</p>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-[#6b6b6b]">No orders yet</div>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-[#2a2a2e]">
              <h2 className="font-display text-xl text-[#f8f4ef]">Top Selling Products</h2>
              <p className="text-sm text-[#6b6b6b] mt-1">Best performers by quantity</p>
            </div>
            <div className="divide-y divide-[#2a2a2e]/50">
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <div key={product.id} className="p-4 hover:bg-[#0c0c0e]/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="w-6 h-6 rounded-full bg-[#c9b89a]/20 flex items-center justify-center text-xs font-medium text-[#c9b89a]">
                        {index + 1}
                      </span>
                      <div className="w-12 h-12 rounded-lg bg-[#2a2a2e] overflow-hidden shrink-0">
                        {product.images && product.images[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#6b6b6b]">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#f8f4ef] truncate">{product.name}</p>
                        <p className="text-xs text-[#6b6b6b]">{product.total_sold} sold</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-[#f8f4ef]">{formatPrice(product.revenue)}</p>
                        <p className="text-xs text-[#6b6b6b]">revenue</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-[#6b6b6b]">No product data available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
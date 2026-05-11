import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, AlertTriangle, XCircle, Plus, Minus, Search, Filter, ArrowUpDown, RefreshCw } from 'lucide-react';
import Badge from '../../components/ui/Badge';

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-chi-drab-54.vercel.app/api';

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('quantity');
  const [updating, setUpdating] = useState(null);
  const token = localStorage.getItem('token');

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/inventory`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setInventory(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const updateStock = async (productId, change) => {
    setUpdating(productId);
    try {
      const res = await fetch(`${API_URL}/products/${productId}/inventory`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(change > 0 ? { increment: change } : { decrement: Math.abs(change) })
      });
      const data = await res.json();
      if (data.success) {
        setInventory(prev => prev.map(item =>
          item.product_id === productId ? { ...item, quantity: data.data.quantity } : item
        ));
      }
    } catch (err) {
      console.error('Failed to update stock:', err);
    } finally {
      setUpdating(null);
    }
  };

  const setStock = async (productId, quantity) => {
    setUpdating(productId);
    try {
      const res = await fetch(`${API_URL}/products/${productId}/inventory`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: parseInt(quantity) })
      });
      const data = await res.json();
      if (data.success) {
        setInventory(prev => prev.map(item =>
          item.product_id === productId ? { ...item, quantity: data.data.quantity } : item
        ));
      }
    } catch (err) {
      console.error('Failed to set stock:', err);
    } finally {
      setUpdating(null);
    }
  };

  const getStatus = (item) => {
    if (item.quantity === 0) return { label: 'Out of Stock', variant: 'error', icon: XCircle };
    if (item.quantity <= item.low_stock_threshold) return { label: 'Low Stock', variant: 'warning', icon: AlertTriangle };
    return { label: 'In Stock', variant: 'success', icon: Package };
  };

  const filteredInventory = inventory
    .filter(item => {
      if (filter === 'all') return true;
      if (filter === 'low') return item.quantity > 0 && item.quantity <= item.low_stock_threshold;
      if (filter === 'out') return item.quantity === 0;
      if (filter === 'good') return item.quantity > item.low_stock_threshold;
      return true;
    })
    .filter(item =>
      item.product_name?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'quantity') return a.quantity - b.quantity;
      if (sortBy === 'name') return (a.product_name || '').localeCompare(b.product_name || '');
      if (sortBy === 'threshold') return a.low_stock_threshold - b.low_stock_threshold;
      return 0;
    });

  const stats = {
    total: inventory.length,
    lowStock: inventory.filter(i => i.quantity > 0 && i.quantity <= i.low_stock_threshold).length,
    outOfStock: inventory.filter(i => i.quantity === 0).length,
    inStock: inventory.filter(i => i.quantity > i.low_stock_threshold).length,
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] pt-20 pb-16">
      <div className="max-w-350 mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-[#c9b89a]" />
              <span className="text-[#c9b89a] text-xs tracking-[0.3em] uppercase">Inventory</span>
            </div>
            <h1 className="font-display text-4xl text-[#f8f4ef]">Stock Management</h1>
          </div>
          <button
            onClick={fetchInventory}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#2a2a2e] text-[#a8a4a0] rounded-full hover:border-[#c9b89a]/50 hover:text-[#f8f4ef] transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-xl p-4">
            <p className="text-2xl font-display text-[#f8f4ef]">{stats.total}</p>
            <p className="text-xs text-[#6b6b6b]">Total Products</p>
          </div>
          <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-xl p-4">
            <p className="text-2xl font-display text-green-400">{stats.inStock}</p>
            <p className="text-xs text-[#6b6b6b]">In Stock</p>
          </div>
          <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-xl p-4">
            <p className="text-2xl font-display text-yellow-400">{stats.lowStock}</p>
            <p className="text-xs text-[#6b6b6b]">Low Stock</p>
          </div>
          <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-xl p-4">
            <p className="text-2xl font-display text-red-400">{stats.outOfStock}</p>
            <p className="text-xs text-[#6b6b6b]">Out of Stock</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b6b]" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#1a1a1e] border border-[#2a2a2e] rounded-full text-[#f8f4ef] placeholder-[#6b6b6b] focus:border-[#c9b89a] focus:outline-none transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#6b6b6b]" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 bg-[#1a1a1e] border border-[#2a2a2e] rounded-full text-[#f8f4ef] focus:outline-none focus:border-[#c9b89a] transition-colors cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="good">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-[#1a1a1e] border border-[#2a2a2e] rounded-full text-[#f8f4ef] focus:outline-none focus:border-[#c9b89a] transition-colors cursor-pointer"
            >
              <option value="quantity">Sort by Stock</option>
              <option value="name">Sort by Name</option>
              <option value="threshold">Sort by Threshold</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-[#c9b89a]/30 border-t-[#c9b89a] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2a2e]">
                    <th className="text-left p-4 text-xs font-medium text-[#6b6b6b] uppercase tracking-wider">Product</th>
                    <th className="text-left p-4 text-xs font-medium text-[#6b6b6b] uppercase tracking-wider">Current Stock</th>
                    <th className="text-left p-4 text-xs font-medium text-[#6b6b6b] uppercase tracking-wider">Threshold</th>
                    <th className="text-left p-4 text-xs font-medium text-[#6b6b6b] uppercase tracking-wider">Status</th>
                    <th className="text-left p-4 text-xs font-medium text-[#6b6b6b] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-[#6b6b6b]">
                        No products found
                      </td>
                    </tr>
                  ) : filteredInventory.map((item, index) => {
                    const status = getStatus(item);
                    return (
                      <tr
                        key={item.product_id}
                        className="border-b border-[#2a2a2e]/50 hover:bg-[#0c0c0e]/30 transition-colors"
                      >
                        <td className="p-4">
                          <Link
                            to={`/admin/products/${item.product_id}`}
                            className="flex items-center gap-3 hover:text-[#c9b89a] transition-colors"
                          >
                            <img
                              src={item.product_image || 'https://picsum.photos/48/48'}
                              alt={item.product_name}
                              className="w-12 h-12 rounded-lg object-cover bg-[#0c0c0e]"
                            />
                            <div>
                              <p className="text-sm text-[#f8f4ef] font-medium">{item.product_name}</p>
                              <p className="text-xs text-[#6b6b6b]">ID: {item.product_id}</p>
                            </div>
                          </Link>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              defaultValue={item.quantity}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  setStock(item.product_id, e.target.value);
                                }
                              }}
                              className="w-20 px-3 py-2 bg-[#0c0c0e] border border-[#2a2a2e] rounded-lg text-[#f8f4ef] text-center focus:border-[#c9b89a] focus:outline-none"
                            />
                            <span className="text-sm text-[#6b6b6b]">units</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-[#a8a4a0]">{item.low_stock_threshold}</span>
                        </td>
                        <td className="p-4">
                          <Badge variant={status.variant}>
                            <status.icon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateStock(item.product_id, -1)}
                              disabled={updating === item.product_id || item.quantity === 0}
                              className="p-2 bg-[#0c0c0e] border border-[#2a2a2e] rounded-lg hover:border-red-500/50 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateStock(item.product_id, 1)}
                              disabled={updating === item.product_id}
                              className="p-2 bg-[#0c0c0e] border border-[#2a2a2e] rounded-lg hover:border-green-500/50 hover:text-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateStock(item.product_id, 10)}
                              disabled={updating === item.product_id}
                              className="px-3 py-2 bg-[#0c0c0e] border border-[#2a2a2e] rounded-lg hover:border-green-500/50 hover:text-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                              +10
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;

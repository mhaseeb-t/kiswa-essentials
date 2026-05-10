import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { LayoutDashboard, Package, ShoppingBag, Users, FolderTree, Settings, LogOut, Sparkles } from 'lucide-react';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const adminNavItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, roles: ['ADMIN'] },
    { name: 'Products', path: '/admin/products', icon: Package, roles: ['ADMIN'] },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag, roles: ['ADMIN', 'STAFF'] },
    { name: 'Customers', path: '/admin/customers', icon: Users, roles: ['ADMIN'] },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree, roles: ['ADMIN'] },
  ];

  const filteredNavItems = adminNavItems.filter(item => item.roles.includes(user?.role));

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e]">
      {/* Admin Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#1a1a1e] border-r border-[#2a2a2e] flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[#2a2a2e]">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#c9b89a]" />
            <span className="font-display text-xl tracking-[0.25em] text-[#f8f4ef]">KISWA</span>
          </Link>
          <p className="text-xs text-[#6b6b6b] mt-1">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                location.pathname === item.path
                  ? 'bg-[#c9b89a] text-[#0c0c0e]'
                  : 'text-[#a8a4a0] hover:bg-[#2a2a2e] hover:text-[#f8f4ef]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-[#2a2a2e]">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#a8a4a0] hover:bg-[#2a2a2e] hover:text-[#f8f4ef] transition-all mb-2"
          >
            ← Back to Store
          </Link>
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm text-[#f8f4ef]">{user?.name}</p>
              <p className="text-xs text-[#6b6b6b]">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
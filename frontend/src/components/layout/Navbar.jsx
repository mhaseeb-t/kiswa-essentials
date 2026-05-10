import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, Menu, X, Search, User, LogOut, ChevronDown, Sparkles, Globe, MapPin, Languages } from 'lucide-react';
import { toggleCart } from '../../store/slices/cartSlice';
import { toggleMenu } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { selectCartItemsCount } from '../../store/slices/cartSlice';
import { setLanguage, setRegion } from '../../store/slices/settingsSlice';
import CartDrawer from '../cart/CartDrawer';
import useRegionDetection from '../../hooks/useRegionDetection';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isRegionMenuOpen, setIsRegionMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const cartItemsCount = useSelector(selectCartItemsCount);
  const { isMenuOpen } = useSelector((state) => state.ui);
  const { language, regionCode, region } = useSelector((state) => state.settings);

  useRegionDetection();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      dispatch(toggleMenu());
    }
    setIsUserMenuOpen(false);
  }, [location, isMenuOpen, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleRegionChange = (code, currency) => {
    dispatch(setRegion({ region, code, currency }));
    setIsRegionMenuOpen(false);
  };

  const handleLanguageChange = (lang) => {
    dispatch(setLanguage(lang));
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'Collections', path: '/products?category=kurtas' },
    { name: 'About', path: '/about' },
  ];

  const regions = [
    { code: 'UK', name: 'United Kingdom', currency: 'GBP', symbol: '£' },
    { code: 'US', name: 'United States', currency: 'USD', symbol: '$' },
    { code: 'PK', name: 'Pakistan', currency: 'PKR', symbol: '₨' },
    { code: 'AE', name: 'UAE', currency: 'AED', symbol: 'د.إ' },
    { code: 'IN', name: 'India', currency: 'INR', symbol: '₹' },
    { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', symbol: '﷼' },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ur', name: 'اردو' },
    { code: 'ar', name: 'العربية' },
    { code: 'hi', name: 'हिंदी' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'glass border-b border-[#2a2a2e]/50' : 'bg-[#0c0c0e]/95'
      }`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Sparkles className="w-6 h-6 text-[#c9b89a] group-hover:rotate-45 transition-transform duration-300" />
                <div className="absolute inset-0 bg-[#c9b89a] blur-lg opacity-0 group-hover:opacity-30 transition-opacity" />
              </div>
              <span className="font-display text-xl tracking-[0.25em] text-[#f8f4ef] group-hover:text-[#c9b89a] transition-colors">
                KISWA
              </span>
              <span className="font-light text-xl tracking-[0.15em] text-[#c9b89a]/70">
                ESSENTIALS
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-sm tracking-[0.15em] uppercase transition-colors group ${
                    location.pathname === link.path ? 'text-[#c9b89a]' : 'text-[#a8a4a0] hover:text-[#f8f4ef]'
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 w-0 h-[1px] bg-[#c9b89a] transition-all duration-300 group-hover:w-full ${
                    location.pathname === link.path ? 'w-full' : ''
                  }`} />
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Region Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsRegionMenuOpen(!isRegionMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-[#a8a4a0] hover:text-[#f8f4ef] hover:bg-[#1a1a1e]/50 rounded-full transition-all"
                >
                  <MapPin className="w-4 h-4 text-[#c9b89a]" />
                  <span className="hidden sm:inline">{regionCode || 'UK'}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {isRegionMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1e] border border-[#2a2a2e] rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                    {regions.map((r) => (
                      <button
                        key={r.code}
                        onClick={() => handleRegionChange(r.code, r.currency)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                          regionCode === r.code ? 'bg-[#c9b89a]/10 text-[#c9b89a]' : 'text-[#a8a4a0] hover:bg-[#2a2a2e]'
                        }`}
                      >
                        <span>{r.name}</span>
                        <span className="text-[#6b6b6b]">{r.symbol}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="p-2 text-[#a8a4a0] hover:text-[#f8f4ef] hover:bg-[#1a1a1e]/50 rounded-full transition-all"
                  title="Language"
                >
                  <Languages className="w-5 h-5" />
                </button>
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-[#1a1a1e] border border-[#2a2a2e] rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          handleLanguageChange(lang.code);
                          setIsLanguageMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                          language === lang.code ? 'bg-[#c9b89a]/10 text-[#c9b89a]' : 'text-[#a8a4a0] hover:bg-[#2a2a2e]'
                        }`}
                      >
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search */}
              <div className="relative">
                {isSearchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center animate-fadeIn">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-48 sm:w-64 py-2 px-4 bg-[#1a1a1e]/80 border border-[#c9b89a]/30 rounded-full text-sm text-[#f8f4ef] placeholder-[#6b6b6b] focus:outline-none focus:border-[#c9b89a] transition-all"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="ml-2 p-2 text-[#6b6b6b] hover:text-[#f8f4ef] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2.5 text-[#a8a4a0] hover:text-[#c9b89a] hover:bg-[#1a1a1e]/50 rounded-full transition-all"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Cart */}
              <button
                onClick={() => dispatch(toggleCart())}
                className="relative p-2.5 text-[#a8a4a0] hover:text-[#c9b89a] hover:bg-[#1a1a1e]/50 rounded-full transition-all group"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#c9b89a] text-[#0c0c0e] text-[10px] font-bold rounded-full flex items-center justify-center animate-fadeIn">
                    {cartItemsCount > 9 ? '9+' : cartItemsCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {token ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-2 text-[#a8a4a0] hover:text-[#c9b89a] hover:bg-[#1a1a1e]/50 rounded-full transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#c9b89a] to-[#a89878] flex items-center justify-center">
                      <span className="text-[#0c0c0e] text-xs font-medium">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`absolute right-0 top-full mt-2 w-56 bg-[#1a1a1e] border border-[#2a2a2e] rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${
                    isUserMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 invisible'
                  }`}>
                    <div className="p-4 border-b border-[#2a2a2e]">
                      <p className="text-sm text-[#f8f4ef] font-medium truncate">{user?.name}</p>
                      <p className="text-xs text-[#6b6b6b] truncate mt-0.5">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#a8a4a0] hover:text-[#f8f4ef] hover:bg-[#2a2a2e]/50 transition-colors">
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link to="/my-orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#a8a4a0] hover:text-[#f8f4ef] hover:bg-[#2a2a2e]/50 transition-colors">
                        <ShoppingCart className="w-4 h-4" />
                        My Orders
                      </Link>
                      {user?.role === 'ADMIN' && (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#c9b89a] hover:bg-[#2a2a2e]/50 transition-colors">
                          <Sparkles className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}
                      {user?.role === 'STAFF' && (
                        <Link to="/staff/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#c9b89a] hover:bg-[#2a2a2e]/50 transition-colors">
                          <Sparkles className="w-4 h-4" />
                          Staff Panel
                        </Link>
                      )}
                    </div>
                    <div className="py-2 border-t border-[#2a2a2e]">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-[#c9b89a] text-[#0c0c0e] text-sm font-medium rounded-full hover:bg-[#d4c9a8] transition-all hover:scale-105"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => dispatch(toggleMenu())}
                className="lg:hidden p-2.5 text-[#a8a4a0] hover:text-[#f8f4ef] hover:bg-[#1a1a1e]/50 rounded-full transition-all"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden glass border-t border-[#2a2a2e]/50 transition-all duration-300 ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-3 text-sm tracking-[0.15em] uppercase transition-colors ${
                  location.pathname === link.path ? 'text-[#c9b89a]' : 'text-[#a8a4a0]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {!token && (
              <Link
                to="/login"
                className="block py-3 text-sm tracking-[0.15em] uppercase text-[#c9b89a]"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
      <CartDrawer />
    </>
  );
};

export default Navbar;
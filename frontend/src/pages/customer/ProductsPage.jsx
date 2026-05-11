import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, SlidersHorizontal, X, Grid3X3, LayoutList } from 'lucide-react';
import ProductGrid from '../../components/product/ProductGrid';
import ProductFilters from '../../components/product/ProductFilters';
import { selectFilters, setFilters, setAvailableFilters } from '../../store/slices/productSlice';

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-chi-drab-54.vercel.app/api';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [error, setError] = useState('');
  const filters = useSelector(selectFilters);
  const { regionCode } = useSelector((state) => state.settings);

  const fetchAvailableFilters = async () => {
    try {
      const response = await fetch(`${API_URL}/filters`);
      const data = await response.json();
      if (data.success && data.filters) {
        dispatch(setAvailableFilters(data.filters));
      }
    } catch (err) {
      console.error('Failed to fetch available filters:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      const search = searchParams.get('search');
      if (search) params.set('search', search);

      const category = searchParams.get('category');
      if (category) params.set('category_id', category);

      if (filters.categories.length > 0) {
        params.set('category_id', filters.categories[0]);
      }

      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      if (filters.color) params.set('color', filters.color);
      if (filters.size) params.set('size', filters.size);
      if (filters.sort && filters.sort !== 'newest') params.set('sort', filters.sort);
      if (filters.inStock) params.set('in_stock', 'true');
      if (regionCode) params.set('region', regionCode);

      const response = await fetch(`${API_URL}/products?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.products || []);
      } else {
        setError(data.message || 'Failed to load products');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableFilters();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams, filters, regionCode]);

  const activeFiltersCount = filters.categories.length + (filters.minPrice ? 1 : 0) + (filters.maxPrice ? 1 : 0) + (filters.color ? 1 : 0) + (filters.size ? 1 : 0) + (filters.inStock ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#0c0c0e] pt-20">
      {/* Hero Banner */}
      <div className="relative h-48 md:h-64 bg-linear-to-br from-[#1a1a1e] via-[#0c0c0e] to-[#1a1a1e] overflow-hidden">
        <div className="absolute inset-0 pattern-arabesque opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="text-[#c9b89a] text-xs tracking-[0.3em] uppercase mb-4 block">Discover</span>
          <h1 className="font-display text-4xl md:text-5xl text-[#f8f4ef]">Our Collection</h1>
        </div>
      </div>

      <div className="max-w-350 mx-auto px-6 lg:px-8 py-8 lg:py-12">
        {/* Header with Search & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-8">
          <div className="flex-1 relative max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b]" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchParams.get('search') || ''}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams);
                if (e.target.value) {
                  params.set('search', e.target.value);
                } else {
                  params.delete('search');
                }
                setSearchParams(params);
              }}
              className="w-full pl-14 pr-4 py-4 bg-[#1a1a1e] border border-[#2a2a2e] rounded-full text-[#f8f4ef] placeholder-[#6b6b6b] focus:outline-none focus:border-[#c9b89a]/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all ${
                showFilters
                  ? 'bg-[#c9b89a] text-[#0c0c0e] border-[#c9b89a]'
                  : 'bg-[#1a1a1e] text-[#a8a4a0] border-[#2a2a2e] hover:border-[#c9b89a]/50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#0c0c0e] text-[#c9b89a] text-xs flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <div className="hidden md:flex items-center gap-1 bg-[#1a1a1e] border border-[#2a2a2e] rounded-full p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-[#c9b89a] text-[#0c0c0e]' : 'text-[#6b6b6b] hover:text-[#f8f4ef]'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-full transition-colors ${viewMode === 'list' ? 'bg-[#c9b89a] text-[#0c0c0e]' : 'text-[#6b6b6b] hover:text-[#f8f4ef]'}`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>

            <span className="text-sm text-[#6b6b6b]">
              {products.length} {products.length === 1 ? 'product' : 'products'}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Mobile Filters Drawer */}
        {showFilters && (
          <div className="lg:hidden mb-8 animate-fadeIn">
            <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg text-[#f8f4ef]">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-2 text-[#6b6b6b] hover:text-[#f8f4ef]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ProductFilters />
            </div>
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-6">
                <h3 className="font-display text-lg text-[#f8f4ef] mb-6">Refine Selection</h3>
                <ProductFilters />
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <ProductGrid products={products} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

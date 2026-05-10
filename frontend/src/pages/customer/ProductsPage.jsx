import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Grid3X3, LayoutList } from 'lucide-react';
import ProductGrid from '../../components/product/ProductGrid';
import ProductFilters from '../../components/product/ProductFilters';
import { MOCK_PRODUCTS } from '../../utils/constants';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const [filters, setFilters] = useState({
    categories: [],
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
    inStock: false,
  });

  const categories = [
    { _id: 'kurtas', name: 'Kurtas' },
    { _id: 'shalwar-kameez', name: 'Shalwar Kameez' },
    { _id: 'shawls', name: 'Shawls' },
    { _id: 'perfumes', name: 'Perfumes' },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      let filtered = [...MOCK_PRODUCTS];

      const search = searchParams.get('search');
      if (search) {
        filtered = filtered.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      const category = searchParams.get('category');
      if (category) {
        filtered = filtered.filter((p) =>
          p.category.toLowerCase() === category
        );
      }

      if (filters.categories.length > 0) {
        filtered = filtered.filter((p) =>
          filters.categories.includes(p.category)
        );
      }

      if (filters.minPrice) {
        filtered = filtered.filter((p) => p.price >= parseFloat(filters.minPrice));
      }

      if (filters.maxPrice) {
        filtered = filtered.filter((p) => p.price <= parseFloat(filters.maxPrice));
      }

      if (filters.inStock) {
        filtered = filtered.filter((p) => p.stock > 0);
      }

      if (filters.sort === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (filters.sort === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
      }

      setProducts(filtered);
      setLoading(false);
    }, 500);
  }, [searchParams, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const activeFiltersCount = filters.categories.length + (filters.minPrice ? 1 : 0) + (filters.maxPrice ? 1 : 0) + (filters.inStock ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#0c0c0e] pt-20">
      {/* Hero Banner */}
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#1a1a1e] via-[#0c0c0e] to-[#1a1a1e] overflow-hidden">
        <div className="absolute inset-0 pattern-arabesque opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="text-[#c9b89a] text-xs tracking-[0.3em] uppercase mb-4 block">Discover</span>
          <h1 className="font-display text-4xl md:text-5xl text-[#f8f4ef]">Our Collection</h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8 lg:py-12">
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
              <ProductFilters
                categories={categories}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-6">
                <h3 className="font-display text-lg text-[#f8f4ef] mb-6">Refine Selection</h3>
                <ProductFilters
                  categories={categories}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
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
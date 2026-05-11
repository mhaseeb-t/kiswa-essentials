import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, Filter, X, ChevronDown, Loader2, Package } from 'lucide-react';
import api from '../../api/axios';
import ProductCard from '../../components/product/ProductCard';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { currency, symbol } = useSelector((state) => state.settings);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Filters
  const [sortBy, setSortBy] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSection, setExpandedSection] = useState('sort');

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get('/products', { params: { type: 'categories' } });
      if (response.data.success) {
        setCategories(response.data.categories || []);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    if (!query.trim()) {
      setProducts([]);
      setTotal(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/products', {
        params: {
          search_query: query.trim(),
          search_type: 'full',
          limit: 50,
          sort: sortBy,
          category_id: categoryFilter || undefined,
        },
      });

      if (response.data.success) {
        setProducts(response.data.products || []);
        setTotal(response.data.total || 0);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [query, sortBy, categoryFilter]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newQuery = formData.get('q');
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery.trim() });
    }
  };

  const clearSearch = () => {
    setSearchParams({});
    setProducts([]);
    setTotal(0);
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
  ];

  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="border-b border-[#2a2a2e]/50 last:border-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between py-4 text-[#f8f4ef] hover:text-[#c9b89a] transition-colors"
      >
        <span className="text-sm font-medium tracking-wide">{title}</span>
        {expandedSection === sectionKey ? (
          <ChevronDown className="w-4 h-4 text-[#c9b89a]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#6b6b6b]" />
        )}
      </button>
      {expandedSection === sectionKey && (
        <div className="pb-4">{children}</div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0c0c0e] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#6b6b6b] pointer-events-none" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search products..."
                className="w-full py-4 pl-14 pr-14 bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl text-lg text-[#f8f4ef] placeholder-[#6b6b6b] focus:outline-none focus:border-[#c9b89a] focus:ring-1 focus:ring-[#c9b89a]/30 transition-all"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-[#6b6b6b] hover:text-[#f8f4ef] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            {query ? (
              <>
                <h1 className="text-2xl font-display text-[#f8f4ef] tracking-wide">
                  Search Results for "{query}"
                </h1>
                <p className="text-sm text-[#6b6b6b] mt-1">
                  {total} {total === 1 ? 'product' : 'products'} found
                </p>
              </>
            ) : (
              <h1 className="text-2xl font-display text-[#f8f4ef] tracking-wide">
                All Products
              </h1>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1e] border border-[#2a2a2e] rounded-full text-sm text-[#a8a4a0] hover:text-[#f8f4ef] hover:border-[#c9b89a] transition-all"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-[#1a1a1e] border border-[#2a2a2e] rounded-full text-sm text-[#a8a4a0] hover:text-[#f8f4ef] hover:border-[#c9b89a] transition-all cursor-pointer focus:outline-none focus:border-[#c9b89a]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b6b] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Filters Sidebar (Desktop) */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 bg-[#1a1a1e]/50 rounded-2xl p-6 border border-[#2a2a2e]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-[#f8f4ef] tracking-wide">Filters</h3>
                {(categoryFilter) && (
                  <button
                    onClick={() => setCategoryFilter('')}
                    className="text-xs text-[#c9b89a] hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-0">
                <FilterSection title="Sort By" sectionKey="sort">
                  <div className="space-y-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          sortBy === option.value
                            ? 'bg-[#c9b89a]/10 text-[#c9b89a]'
                            : 'text-[#a8a4a0] hover:bg-[#2a2a2e] hover:text-[#f8f4ef]'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="Category" sectionKey="category">
                  <div className="space-y-1">
                    <button
                      onClick={() => setCategoryFilter('')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        !categoryFilter
                          ? 'bg-[#c9b89a]/10 text-[#c9b89a]'
                          : 'text-[#a8a4a0] hover:bg-[#2a2a2e] hover:text-[#f8f4ef]'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setCategoryFilter(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          categoryFilter === cat.id
                            ? 'bg-[#c9b89a]/10 text-[#c9b89a]'
                            : 'text-[#a8a4a0] hover:bg-[#2a2a2e] hover:text-[#f8f4ef]'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </FilterSection>
              </div>
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
              <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a1e] rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-[#f8f4ef]">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 text-[#6b6b6b] hover:text-[#f8f4ef]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-0">
                  <FilterSection title="Sort By" sectionKey="sort">
                    <div className="space-y-2">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setShowFilters(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            sortBy === option.value
                              ? 'bg-[#c9b89a]/10 text-[#c9b89a]'
                              : 'text-[#a8a4a0] hover:bg-[#2a2a2e] hover:text-[#f8f4ef]'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </FilterSection>

                  <FilterSection title="Category" sectionKey="category">
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setCategoryFilter('');
                          setShowFilters(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          !categoryFilter
                            ? 'bg-[#c9b89a]/10 text-[#c9b89a]'
                            : 'text-[#a8a4a0] hover:bg-[#2a2a2e] hover:text-[#f8f4ef]'
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setCategoryFilter(cat.id);
                            setShowFilters(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            categoryFilter === cat.id
                              ? 'bg-[#c9b89a]/10 text-[#c9b89a]'
                              : 'text-[#a8a4a0] hover:bg-[#2a2a2e] hover:text-[#f8f4ef]'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </FilterSection>
                </div>

                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full mt-6 py-3 bg-[#c9b89a] text-[#0c0c0e] rounded-full font-medium hover:bg-[#d4c9a8] transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-[#c9b89a] animate-spin mb-4" />
                <p className="text-[#6b6b6b]">Searching products...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="px-6 py-2 bg-[#c9b89a] text-[#0c0c0e] rounded-full hover:bg-[#d4c9a8] transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Package className="w-16 h-16 text-[#2a2a2e] mb-4" />
                <h3 className="text-xl text-[#f8f4ef] mb-2">No products found</h3>
                <p className="text-[#6b6b6b] mb-6">
                  {query
                    ? `We couldn't find any products matching "${query}"`
                    : 'Try adjusting your filters'}
                </p>
                <div className="flex gap-3">
                  {query && (
                    <button
                      onClick={clearSearch}
                      className="px-6 py-2 border border-[#2a2a2e] text-[#a8a4a0] rounded-full hover:border-[#c9b89a] hover:text-[#f8f4ef] transition-all"
                    >
                      Clear Search
                    </button>
                  )}
                  <Link
                    to="/products"
                    className="px-6 py-2 bg-[#c9b89a] text-[#0c0c0e] rounded-full hover:bg-[#d4c9a8] transition-colors"
                  >
                    Browse All Products
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
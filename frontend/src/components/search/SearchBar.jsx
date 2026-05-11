import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '../../api/axios';
import { formatPrice } from '../../utils/formatPrice';

const RECENT_SEARCHES_KEY = 'kiswa-recent-searches';
const MAX_RECENT_SEARCHES = 5;
const DEBOUNCE_DELAY = 300;

const SearchBar = () => {
  const navigate = useNavigate();
  const { currency, symbol } = useSelector((state) => state.settings);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showRecent, setShowRecent] = useState(false);

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowRecent(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search with useCallback
  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.get('/products', {
        params: {
          search_query: searchQuery.trim(),
          search_type: 'autocomplete',
          limit: 8,
        },
      });

      if (response.data.success) {
        setSuggestions(response.data.products || []);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debounce
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!value.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      setShowRecent(false);
      setIsLoading(false);
      return;
    }

    setIsOpen(true);
    setShowRecent(false);
    setIsLoading(true);

    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, DEBOUNCE_DELAY);
  };

  // Save search to recent searches
  const saveToRecentSearches = (searchTerm) => {
    try {
      const updated = [
        searchTerm,
        ...recentSearches.filter((s) => s !== searchTerm),
      ].slice(0, MAX_RECENT_SEARCHES);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  };

  // Remove item from recent searches
  const removeFromRecentSearches = (searchTerm, e) => {
    e.stopPropagation();
    try {
      const updated = recentSearches.filter((s) => s !== searchTerm);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  };

  // Clear all recent searches
  const clearRecentSearches = () => {
    try {
      setRecentSearches([]);
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // Ignore localStorage errors
    }
  };

  // Navigate to search results
  const goToSearch = (searchTerm) => {
    saveToRecentSearches(searchTerm);
    setQuery('');
    setIsOpen(false);
    setShowRecent(false);
    setSuggestions([]);
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      goToSearch(query.trim());
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    const allItems = showRecent ? recentSearches : suggestions;
    const totalItems = allItems.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < totalItems) {
          const item = allItems[selectedIndex];
          if (showRecent) {
            goToSearch(item);
          } else {
            const product = suggestions[selectedIndex];
            navigate(`/products/${product.id}`);
          }
        } else if (query.trim()) {
          goToSearch(query.trim());
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setShowRecent(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;

      case 'Tab':
        if (isOpen) {
          e.preventDefault();
          setIsOpen(false);
          setShowRecent(false);
        }
        break;
    }
  };

  // Handle focus
  const handleFocus = () => {
    setIsOpen(true);
    if (!query.trim() && recentSearches.length > 0) {
      setShowRecent(true);
    }
  };

  // Clear input
  const clearInput = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setShowRecent(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url;
    }
    return null;
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-[#6b6b6b] pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder="Search products..."
            className="w-full py-3 pl-12 pr-12 bg-[#1a1a1e] border border-[#2a2a2e] rounded-full text-sm text-[#f8f4ef] placeholder-[#6b6b6b] focus:outline-none focus:border-[#c9b89a] focus:ring-1 focus:ring-[#c9b89a]/30 transition-all"
            autoComplete="off"
          />
          {isLoading && (
            <div className="absolute right-14">
              <Loader2 className="w-5 h-5 text-[#c9b89a] animate-spin" />
            </div>
          )}
          {query && !isLoading && (
            <button
              type="button"
              onClick={clearInput}
              className="absolute right-4 p-1 text-[#6b6b6b] hover:text-[#f8f4ef] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
          {/* Recent Searches */}
          {showRecent && recentSearches.length > 0 && (
            <div className="py-2">
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-xs text-[#6b6b6b] uppercase tracking-wider">Recent Searches</span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-[#c9b89a] hover:underline"
                >
                  Clear all
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={search + index}
                  onClick={() => goToSearch(search)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm text-[#a8a4a0] hover:bg-[#2a2a2e] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[#6b6b6b] group-hover:text-[#c9b89a]" />
                    <span>{search}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-[#6b6b6b] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <button
                      onClick={(e) => removeFromRecentSearches(search, e)}
                      className="p-1 text-[#6b6b6b] hover:text-[#f8f4ef] opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Product Suggestions */}
          {!showRecent && suggestions.length > 0 && (
            <div className="py-2">
              {suggestions.map((product, index) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  onClick={() => saveToRecentSearches(query)}
                  className={`flex items-center gap-4 px-4 py-3 transition-colors ${
                    selectedIndex === index ? 'bg-[#2a2a2e]' : 'hover:bg-[#2a2a2e]/50'
                  }`}
                >
                  {getProductImage(product) ? (
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg bg-[#2a2a2e]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-[#2a2a2e] flex items-center justify-center">
                      <Search className="w-5 h-5 text-[#6b6b6b]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#f8f4ef] truncate">{product.name}</p>
                    {product.category_name && (
                      <p className="text-xs text-[#6b6b6b]">{product.category_name}</p>
                    )}
                  </div>
                  <span className="text-sm font-medium text-[#c9b89a]">
                    {symbol}{formatPrice(product.price, currency)}
                  </span>
                </Link>
              ))}

              {/* View All Results */}
              <button
                onClick={() => goToSearch(query)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm text-[#c9b89a] hover:bg-[#2a2a2e] transition-colors border-t border-[#2a2a2e] mt-2"
              >
                <span>View all results for "{query}"</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Empty State */}
          {!showRecent && !isLoading && query.length >= 2 && suggestions.length === 0 && (
            <div className="py-8 px-4 text-center">
              <p className="text-sm text-[#6b6b6b]">No products found for "{query}"</p>
              <button
                onClick={() => goToSearch(query)}
                className="mt-2 text-sm text-[#c9b89a] hover:underline"
              >
                View all results
              </button>
            </div>
          )}

          {/* Hints */}
          {!showRecent && !query.trim() && recentSearches.length === 0 && (
            <div className="py-6 px-4 text-center">
              <p className="text-sm text-[#6b6b6b]">Type to search products...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
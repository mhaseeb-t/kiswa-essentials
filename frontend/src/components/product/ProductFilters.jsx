import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilters, clearFilters } from '../../store/slices/productSlice';

const FilterSection = ({ title, sectionKey, expandedSection, toggleSection, children }) => (
  <div className="border-b border-[#2a2a2e]/50 last:border-0">
    <button
      onClick={() => toggleSection(sectionKey)}
      className="w-full flex items-center justify-between py-4 text-[#f8f4ef] hover:text-[#c9b89a] transition-colors"
    >
      <span className="text-sm font-medium tracking-wide">{title}</span>
      {expandedSection === sectionKey ? (
        <ChevronUp className="w-4 h-4 text-[#c9b89a]" />
      ) : (
        <ChevronDown className="w-4 h-4 text-[#6b6b6b]" />
      )}
    </button>
    {expandedSection === sectionKey && (
      <div className="pb-4">{children}</div>
    )}
  </div>
);

const CheckIcon = () => (
  <svg className="w-3 h-3 text-[#0c0c0e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const ProductFilters = ({ categories: propCategories }) => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.product?.filters || { categories: [], minPrice: '', maxPrice: '', color: '', size: '', sort: 'newest', inStock: false });
  const availableFilters = useSelector((state) => state.product?.availableFilters || { colors: [], sizes: [], priceRange: { min: 0, max: 1000 } });
  const [expandedSection, setExpandedSection] = useState('category');
  const [categories] = useState(propCategories || []);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleCategoryChange = (categoryId, e) => {
    e.stopPropagation();
    e.preventDefault();
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId];
    dispatch(setFilters({ ...filters, categories: newCategories }));
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ ...filters, [key]: value }));
  };

  const handleClearAll = () => {
    dispatch(clearFilters());
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
  ];

  const hasActiveColorOrSize = filters.color || filters.size;

  return (
    <div className="space-y-0">
      <FilterSection title="Category" sectionKey="category" expandedSection={expandedSection} toggleSection={toggleSection}>
        <div className="space-y-3">
          {categories.map((cat) => (
            <label
              key={cat._id || cat.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                onClick={(e) => handleCategoryChange(cat._id || cat.id, e)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
                  filters.categories.includes(cat._id || cat.id)
                    ? 'bg-[#c9b89a] border-[#c9b89a]'
                    : 'border-[#2a2a2e] group-hover:border-[#c9b89a]/50'
                }`}>
                {filters.categories.includes(cat._id || cat.id) && <CheckIcon />}
              </div>
              <span className="text-sm text-[#a8a4a0] group-hover:text-[#f8f4ef] transition-colors">
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range" sectionKey="price" expandedSection={expandedSection} toggleSection={toggleSection}>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b6b] text-sm">£</span>
              <input
                type="number"
                placeholder={`Min (${availableFilters.priceRange?.min || 0})`}
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 bg-[#0c0c0e] border border-[#2a2a2e] rounded-lg text-[#f8f4ef] text-sm placeholder-[#6b6b6b] focus:outline-none focus:border-[#c9b89a]/50"
              />
            </div>
            <span className="text-[#6b6b6b]">-</span>
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b6b] text-sm">£</span>
              <input
                type="number"
                placeholder={`Max (${availableFilters.priceRange?.max || 1000})`}
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 bg-[#0c0c0e] border border-[#2a2a2e] rounded-lg text-[#f8f4ef] text-sm placeholder-[#6b6b6b] focus:outline-none focus:border-[#c9b89a]/50"
              />
            </div>
          </div>
          <button
            onClick={() => { handleFilterChange('minPrice', ''); handleFilterChange('maxPrice', ''); }}
            className="text-xs text-[#c9b89a] hover:underline"
          >
            Clear price range
          </button>
        </div>
      </FilterSection>

      {availableFilters.colors?.length > 0 && (
        <FilterSection title="Color" sectionKey="color" expandedSection={expandedSection} toggleSection={toggleSection}>
          <div className="flex flex-wrap gap-2">
            {availableFilters.colors.map((color) => (
              <button
                key={color}
                onClick={() => handleFilterChange('color', filters.color === color ? '' : color)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                  filters.color === color
                    ? 'bg-[#c9b89a] text-[#0c0c0e] border-[#c9b89a]'
                    : 'border-[#2a2a2e] text-[#a8a4a0] hover:border-[#c9b89a]/50'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {availableFilters.sizes?.length > 0 && (
        <FilterSection title="Size" sectionKey="size" expandedSection={expandedSection} toggleSection={toggleSection}>
          <div className="flex flex-wrap gap-2">
            {availableFilters.sizes.map((size) => (
              <button
                key={size}
                onClick={() => handleFilterChange('size', filters.size === size ? '' : size)}
                className={`w-10 h-10 rounded-lg text-sm font-medium border transition-all ${
                  filters.size === size
                    ? 'bg-[#c9b89a] text-[#0c0c0e] border-[#c9b89a]'
                    : 'border-[#2a2a2e] text-[#a8a4a0] hover:border-[#c9b89a]/50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Sort By" sectionKey="sort" expandedSection={expandedSection} toggleSection={toggleSection}>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                onClick={() => handleFilterChange('sort', option.value)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                  filters.sort === option.value
                    ? 'border-[#c9b89a]'
                    : 'border-[#2a2a2e] group-hover:border-[#c9b89a]/50'
                }`}>
                {filters.sort === option.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#c9b89a]" />
                )}
              </div>
              <span className="text-sm text-[#a8a4a0] group-hover:text-[#f8f4ef] transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <div className="pt-4">
        <div
          onClick={() => handleFilterChange('inStock', !filters.inStock)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
            filters.inStock
              ? 'bg-[#c9b89a] border-[#c9b89a]'
              : 'border-[#2a2a2e] group-hover:border-[#c9b89a]/50'
          }`}>
            {filters.inStock && <CheckIcon />}
          </div>
          <span className="text-sm text-[#f8f4ef]">In Stock Only</span>
        </div>
      </div>

      <button
        onClick={handleClearAll}
        className="w-full flex items-center justify-center gap-2 mt-6 py-3 bg-[#0c0c0e] border border-[#2a2a2e] rounded-lg text-sm text-[#6b6b6b] hover:text-[#c9b89a] hover:border-[#c9b89a]/50 transition-colors"
      >
        <X className="w-4 h-4" />
        Clear All Filters
      </button>
    </div>
  );
};

export default ProductFilters;
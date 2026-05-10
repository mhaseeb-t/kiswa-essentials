import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

const ProductFilters = ({ categories, filters, onFilterChange }) => {
  const [expandedSection, setExpandedSection] = useState('category');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleCategoryChange = (categoryId, e) => {
    e.stopPropagation();
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
  ];

  const FilterSection = ({ title, sectionKey, children }) => (
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

  return (
    <div className="space-y-0">
      {/* Category Filter */}
      <FilterSection title="Category" sectionKey="category">
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
                {filters.categories.includes(cat._id || cat.id) && (
                  <svg className="w-3 h-3 text-[#0c0c0e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-[#a8a4a0] group-hover:text-[#f8f4ef] transition-colors">
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection title="Price Range" sectionKey="price">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b6b] text-sm">£</span>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value })}
                className="w-full pl-8 pr-3 py-2.5 bg-[#0c0c0e] border border-[#2a2a2e] rounded-lg text-[#f8f4ef] text-sm placeholder-[#6b6b6b] focus:outline-none focus:border-[#c9b89a]/50"
              />
            </div>
            <span className="text-[#6b6b6b]">-</span>
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b6b] text-sm">£</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
                className="w-full pl-8 pr-3 py-2.5 bg-[#0c0c0e] border border-[#2a2a2e] rounded-lg text-[#f8f4ef] text-sm placeholder-[#6b6b6b] focus:outline-none focus:border-[#c9b89a]/50"
              />
            </div>
          </div>
          <button
            onClick={() => onFilterChange({ ...filters, minPrice: '', maxPrice: '' })}
            className="text-xs text-[#c9b89a] hover:underline"
          >
            Clear price range
          </button>
        </div>
      </FilterSection>

      {/* Sort By Filter */}
      <FilterSection title="Sort By" sectionKey="sort">
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                onClick={() => onFilterChange({ ...filters, sort: option.value })}
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

      {/* Availability Filter */}
      <div className="pt-4">
        <div
          onClick={() => onFilterChange({ ...filters, inStock: !filters.inStock })}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
            filters.inStock
              ? 'bg-[#c9b89a] border-[#c9b89a]'
              : 'border-[#2a2a2e] group-hover:border-[#c9b89a]/50'
          }`}>
            {filters.inStock && (
              <svg className="w-3 h-3 text-[#0c0c0e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-sm text-[#f8f4ef]">In Stock Only</span>
        </div>
      </div>

      {/* Clear All Button */}
      <button
        onClick={() => onFilterChange({ categories: [], minPrice: '', maxPrice: '', sort: 'newest', inStock: false })}
        className="w-full flex items-center justify-center gap-2 mt-6 py-3 bg-[#0c0c0e] border border-[#2a2a2e] rounded-lg text-sm text-[#6b6b6b] hover:text-[#c9b89a] hover:border-[#c9b89a]/50 transition-colors"
      >
        <X className="w-4 h-4" />
        Clear All Filters
      </button>
    </div>
  );
};

export default ProductFilters;
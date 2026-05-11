import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl overflow-hidden animate-pulse">
            <div className="aspect-3/4 bg-[#2a2a2e]" />
            <div className="p-5 space-y-3">
              <div className="h-3 bg-[#2a2a2e] rounded w-1/3" />
              <div className="h-5 bg-[#2a2a2e] rounded w-3/4" />
              <div className="h-6 bg-[#2a2a2e] rounded w-1/4 mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#1a1a1e] border border-[#2a2a2e] mb-6">
          <svg className="w-8 h-8 text-[#6b6b6b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-xl text-[#f8f4ef] mb-2">No Products Found</h3>
        <p className="text-[#6b6b6b]">Try adjusting your filters or browse our collections.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <div key={product._id || product.id} className="animate-fadeInUp opacity-0" style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}>
          <ProductCard product={product} index={index} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, Minus, Plus, MessageCircle, ChevronDown, ShoppingBag, Truck, RotateCcw, Shield, Heart, Share2, Eye } from 'lucide-react';
import { addItem } from '../../store/slices/cartSlice';
import { formatPrice } from '../../utils/formatPrice';
import Badge from '../../components/ui/Badge';
import StarRating from '../../components/product/StarRating';
import ReviewsList from '../../components/product/ReviewsList';
import ReviewForm from '../../components/product/ReviewForm';

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-chi-drab-54.vercel.app/api';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviewStats, setReviewStats] = useState({ total: 0, average: 0 });
  const [reviewsKey, setReviewsKey] = useState(0);
  const { currency } = useSelector((state) => state.settings);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [productRes, invRes] = await Promise.all([
          fetch(`${API_URL}/products/${id}`),
          fetch(`${API_URL}/products/${id}/inventory`).catch(() => null)
        ]);
        const productData = await productRes.json();
        if (productData.success && productData.data) {
          setProduct(productData.data);
        }
        if (invRes) {
          const invData = await invRes.json();
          if (invData.success) {
            setInventory(invData.data);
          }
        }
        // Fetch review stats
        const reviewsRes = await fetch(`${API_URL}/products/${id}/reviews?limit=1`);
        const reviewsData = await reviewsRes.json();
        if (reviewsData.success) {
          setReviewStats(reviewsData.stats || { total: 0, average: 0 });
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleReviewAdded = () => {
    setReviewsKey((k) => k + 1);
    // Refresh stats
    fetch(`${API_URL}/products/${id}/reviews?limit=1`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setReviewStats(data.stats || { total: 0, average: 0 });
      });
  };

  const currentStock = inventory?.quantity ?? product?.stock ?? 10;

  const getStockStatus = () => {
    if (currentStock === 0) return { label: 'Out of Stock', variant: 'error' };
    if (currentStock <= 5) return { label: `Only ${currentStock} left`, variant: 'warning' };
    return { label: 'In Stock', variant: 'success' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] pt-20 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#c9b89a] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-[#1a1a1e] border border-[#2a2a2e] mx-auto mb-6 flex items-center justify-center">
            <Eye className="w-10 h-10 text-[#6b6b6b]" />
          </div>
          <h2 className="font-display text-2xl text-[#f8f4ef] mb-4">Product Not Found</h2>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9b89a] text-[#0c0c0e] font-medium rounded-full hover:bg-[#d4c9a8] transition-all"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [
    product.image || `https://picsum.photos/400/400?random=${product.id}`,
    `https://picsum.photos/400/400?random=${product.id}a`,
    `https://picsum.photos/400/400?random=${product.id}b`,
  ];

  const stockStatus = getStockStatus();

  const handleAddToCart = () => {
    if (currentStock === 0) return;
    dispatch(addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: images[0],
      quantity,
    }));
  };

  const handleBuyNow = () => {
    if (currentStock === 0) return;
    dispatch(addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: images[0],
      quantity,
    }));
    navigate('/checkout');
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'On orders over £75' },
    { icon: RotateCcw, title: 'Easy Returns', desc: '14-day return policy' },
    { icon: Shield, title: 'Secure Payment', desc: '100% secure checkout' },
  ];

  return (
    <div className="min-h-screen bg-[#0c0c0e] pt-20 pb-16">
      <div className="max-w-350 mx-auto px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8 animate-fadeIn">
          <Link to="/" className="text-[#6b6b6b] hover:text-[#c9b89a] transition-colors">Home</Link>
          <span className="text-[#6b6b6b]">/</span>
          <Link to="/products" className="text-[#6b6b6b] hover:text-[#c9b89a] transition-colors">Products</Link>
          <span className="text-[#6b6b6b]">/</span>
          <span className="text-[#a8a4a0]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4 animate-fadeInUp">
            <div className="relative aspect-square bg-[#1a1a1e] border border-[#2a2a2e] rounded-3xl overflow-hidden group">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0c0c0e]/60 to-transparent" />
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button onClick={() => setIsWishlisted(!isWishlisted)} className={`p-3 rounded-full backdrop-blur-md transition-all ${isWishlisted ? 'bg-[#c9b89a] text-[#0c0c0e]' : 'bg-[#0c0c0e]/60 text-[#f8f4ef]/70 hover:bg-[#0c0c0e]/80'}`}>
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button className="p-3 rounded-full bg-[#0c0c0e]/60 text-[#f8f4ef]/70 hover:bg-[#0c0c0e]/80 backdrop-blur-md transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute top-4 left-4">
                <Badge variant={stockStatus.variant} className="backdrop-blur-md bg-[#0c0c0e]/80 border-0">
                  {stockStatus.label}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-xl overflow-hidden transition-all duration-300 ${selectedImage === index ? 'ring-2 ring-[#c9b89a] ring-offset-2 ring-offset-[#0c0c0e]' : 'border border-[#2a2a2e] hover:border-[#c9b89a]/50'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="animate-fadeInUp delay-200">
            <p className="text-[#c9b89a] text-xs tracking-[0.3em] uppercase mb-3">
              {product.category_name || product.category || 'Collection'}
            </p>
            <h1 className="font-display text-4xl lg:text-5xl text-[#f8f4ef] mb-4 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-display text-3xl text-[#c9b89a]">
                {formatPrice(product.price, currency, true)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-lg text-[#6b6b6b] line-through">
                  {formatPrice(product.original_price, currency, true)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mb-8">
              <StarRating rating={Math.round(reviewStats.average)} size="md" />
              <span className="text-sm text-[#6b6b6b]">
                {reviewStats.average > 0 ? reviewStats.average.toFixed(1) : '0.0'} ({reviewStats.total} review{reviewStats.total !== 1 ? 's' : ''})
              </span>
            </div>
            <p className="text-[#6b6b6b] leading-relaxed mb-8">
              {product.description || 'Experience the perfect blend of tradition and elegance with our handcrafted collection. Made with premium materials and intricate detailing.'}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {features.map((feature) => (
                <div key={feature.title} className="text-center p-4 bg-[#1a1a1e] rounded-xl border border-[#2a2a2e]">
                  <feature.icon className="w-6 h-6 text-[#c9b89a] mx-auto mb-2" />
                  <p className="text-xs text-[#f8f4ef] font-medium">{feature.title}</p>
                  <p className="text-xs text-[#6b6b6b] mt-1">{feature.desc}</p>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <label className="text-sm text-[#a8a4a0] mb-3 block">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-[#1a1a1e] border border-[#2a2a2e] rounded-full">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-[#a8a4a0] hover:text-[#f8f4ef] hover:bg-[#2a2a2e] rounded-full transition-all" disabled={currentStock === 0}>
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 text-[#f8f4ef] font-medium text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(currentStock, quantity + 1))} className="p-3 text-[#a8a4a0] hover:text-[#f8f4ef] hover:bg-[#2a2a2e] rounded-full transition-all" disabled={currentStock === 0}>
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-sm text-[#6b6b6b]">{currentStock} available</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button onClick={() => { handleAddToCart(); navigate('/cart'); }} className="flex-1 flex items-center justify-center gap-3 py-4 bg-[#c9b89a] text-[#0c0c0e] font-medium rounded-full hover:bg-[#d4c9a8] transition-all group disabled:opacity-50 disabled:cursor-not-allowed" disabled={currentStock === 0}>
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Add to Cart
              </button>
              <button onClick={handleBuyNow} className="flex-1 py-4 border border-[#2a2a2e] text-[#f8f4ef] font-medium rounded-full hover:border-[#c9b89a]/50 hover:bg-[#1a1a1e]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled={currentStock === 0}>
                Buy Now
              </button>
            </div>

            <a href="https://wa.me/447123456789" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 py-4 bg-[#25D366]/10 border border-[#25D366]/30 rounded-full text-[#25D366] hover:bg-[#25D366]/20 transition-all mb-8">
              <MessageCircle className="w-5 h-5" />
              Enquire on WhatsApp
            </a>

            <div className="border-t border-[#2a2a2e]">
              {[
                { key: 'description', title: 'Product Details', content: 'Handcrafted with premium cotton blend fabric. Intricate embroidery with golden thread work. Dry clean recommended. Regular fit. Available in multiple sizes.' },
                { key: 'shipping', title: 'Shipping & Delivery', content: 'Free standard shipping on orders over £75. Standard delivery takes 5-7 business days. Express delivery available for £9.99. International shipping available worldwide with tracking.' },
                { key: 'returns', title: 'Returns & Exchanges', content: 'We accept returns within 14 days of delivery. Items must be unworn with original tags attached. Customized items are non-returnable. Contact our support team for return authorization.' },
              ].map((section) => (
                <div key={section.key}>
                  <button onClick={() => toggleSection(section.key)} className="w-full flex items-center justify-between py-5 text-[#f8f4ef] hover:text-[#c9b89a] transition-colors">
                    <span className="font-medium">{section.title}</span>
                    <ChevronDown className={`w-5 h-5 text-[#c9b89a] transition-transform ${expandedSection === section.key ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedSection === section.key && (
                    <div className="pb-5 text-[#6b6b6b] text-sm leading-relaxed animate-fadeIn">
                      {section.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl text-[#f8f4ef]">Customer Reviews</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ReviewsList key={reviewsKey} productId={product.id} />
            </div>
            <div>
              <ReviewForm productId={product.id} onReviewAdded={handleReviewAdded} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetailPage;

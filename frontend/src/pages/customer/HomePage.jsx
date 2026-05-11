import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shirt, Sparkles, Wind, Flame, Star, Truck, Shield, Gift, ChevronDown, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import ProductGrid from '../../components/product/ProductGrid';

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-chi-drab-54.vercel.app/api';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { regionCode } = useSelector((state) => state.settings);

  const categories = [
    { name: 'Kurtas', icon: Shirt, category: 'kurtas', description: 'Traditional elegance' },
    { name: 'Shalwar Kameez', icon: Sparkles, category: 'shalwar-kameez', description: 'Timeless grace' },
    { name: 'Shawls', icon: Wind, category: 'shawls', description: 'Drape in luxury' },
    { name: 'Perfumes', icon: Flame, category: 'perfumes', description: 'Signature scents' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products?featured=true&region=${regionCode || 'UK'}`);
        const data = await response.json();
        if (data.success) {
          setProducts(data.products.slice(0, 8));
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [regionCode]);

  return (
    <div className="min-h-screen">
      {/* Announcement Bar */}
      <div className="relative bg-[#c9b89a] overflow-hidden">
        <div className="absolute inset-0 animate-shimmer" />
        <div className="relative max-w-350 mx-auto px-4 py-2.5 text-center">
          <p className="text-[#0c0c0e] text-sm font-medium tracking-wide">
            Complimentary shipping on orders over £75 — Worldwide delivery available
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-[#0c0c0e] overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-200 h-200 bg-linear-to-bl from-[#c9b89a]/5 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-150 h-150 bg-linear-to-tr from-[#c9b89a]/5 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute inset-0 pattern-arabesque opacity-20" />
        </div>

        <div className="relative max-w-350 mx-auto px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fadeInUp">
              <div>
                <span className="inline-flex items-center gap-2 text-[#c9b89a] text-sm tracking-[0.3em] uppercase mb-6">
                  <span className="w-8 h-px bg-[#c9b89a]" />
                  Premium South Asian Fashion
                </span>
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#f8f4ef] leading-tight mb-6">
                  Where Heritage
                  <br />
                  <span className="text-gradient-gold">Meets</span> Elegance
                </h1>
                <p className="text-lg text-[#6b6b6b] max-w-lg leading-relaxed">
                  Discover exquisite traditional attire and premium fragrances,
                  crafted with centuries of artistry and delivered to your doorstep.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#c9b89a] text-[#0c0c0e] font-medium rounded-full hover:bg-[#d4c9a8] transition-all group"
                >
                  Shop Collection
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/#story"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#2a2a2e] text-[#f8f4ef] font-medium rounded-full hover:border-[#c9b89a]/50 hover:bg-[#1a1a1e]/50 transition-all"
                >
                  Our Story
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-8 pt-8 border-t border-[#2a2a2e]/50">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#c9b89a]" />
                  <span className="text-sm text-[#6b6b6b]">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#c9b89a]" />
                  <span className="text-sm text-[#6b6b6b]">Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-[#c9b89a]" />
                  <span className="text-sm text-[#6b6b6b]">Gift Wrapping</span>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image Placeholder */}
            <div className="relative hidden lg:block animate-fadeInUp delay-300">
              <div className="relative aspect-3/4 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-[#1a1a1e] to-[#2a2a2e]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Shirt className="w-24 h-24 text-[#c9b89a]/20 mx-auto mb-4" />
                      <p className="text-[#6b6b6b]">Hero Image</p>
                    </div>
                  </div>
                </div>
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#c9b89a]/10 rounded-full blur-2xl animate-float" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#c9b89a]/10 rounded-full blur-2xl animate-float delay-200" />
              </div>

              {/* Stats Card */}
              <div className="absolute -bottom-8 -left-8 bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#c9b89a]/20 flex items-center justify-center">
                    <Star className="w-6 h-6 text-[#c9b89a]" />
                  </div>
                  <div>
                    <p className="text-2xl font-display text-[#f8f4ef]">4.9</p>
                    <p className="text-xs text-[#6b6b6b]">2,000+ Reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-[#6b6b6b]" />
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative py-24 bg-[#0a0a0c]">
        <div className="absolute inset-0 pattern-arabesque opacity-10" />
        <div className="relative max-w-350 mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeInUp">
            <span className="text-[#c9b89a] text-sm tracking-[0.3em] uppercase">Explore</span>
            <h2 className="font-display text-4xl lg:text-5xl text-[#f8f4ef] mt-4">Shop by Category</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <Link
                key={cat.category}
                to={`/products?category=${cat.category}`}
                className="group relative bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:border-[#c9b89a]/30 hover:shadow-2xl hover:shadow-[#c9b89a]/5 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-[#c9b89a]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#c9b89a]/10 mb-6 group-hover:bg-[#c9b89a]/20 transition-colors">
                    <cat.icon className="w-8 h-8 text-[#c9b89a]" />
                  </div>
                  <h3 className="font-display text-xl text-[#f8f4ef] mb-2 group-hover:text-[#c9b89a] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-[#6b6b6b] mb-4">{cat.description}</p>
                  <div className="flex items-center justify-center gap-2 text-[#c9b89a] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm">Explore</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="relative py-24 bg-[#0c0c0e]">
        <div className="max-w-350 mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
            <div>
              <span className="text-[#c9b89a] text-sm tracking-[0.3em] uppercase">New Arrivals</span>
              <h2 className="font-display text-3xl lg:text-4xl text-[#f8f4ef] mt-2">Featured Collection</h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-[#c9b89a] hover:text-[#d4c9a8] transition-colors group"
            >
              View All Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-2 border-[#c9b89a]/30 border-t-[#c9b89a] rounded-full animate-spin" />
            </div>
          ) : (
            <ProductGrid products={products} loading={loading} />
          )}
        </div>
      </section>

      {/* Brand Story */}
      <section id="story" className="relative py-24 bg-[#0a0a0c]">
        <div className="absolute inset-0 pattern-arabesque opacity-5" />
        <div className="relative max-w-350 mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="relative animate-fadeIn">
              <div className="aspect-4/5 rounded-3xl overflow-hidden bg-linear-to-br from-[#1a1a1e] to-[#2a2a2e]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-[#c9b89a]/10 mx-auto mb-4 flex items-center justify-center">
                      <Sparkles className="w-16 h-16 text-[#c9b89a]/30" />
                    </div>
                    <p className="text-[#6b6b6b]">Brand Heritage</p>
                  </div>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border border-[#c9b89a]/20 rounded-2xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-[#c9b89a]/20 rounded-2xl" />
            </div>

            {/* Content */}
            <div className="animate-fadeInUp">
              <span className="text-[#c9b89a] text-sm tracking-[0.3em] uppercase">Our Heritage</span>
              <h2 className="font-display text-4xl lg:text-5xl text-[#f8f4ef] mt-4 mb-6 leading-tight">
                Crafted with Passion,
                <br />
                Worn with <span className="text-gradient-gold">Pride</span>
              </h2>
              <div className="space-y-6 text-[#6b6b6b] leading-relaxed">
                <p>
                  At Kiswa Essentials, we celebrate the rich traditions of South
                  Asian craftsmanship while embracing modern elegance. Each piece
                  in our collection tells a story of generations of artisans whose
                  dedication has been passed down through families.
                </p>
                <p>
                  From intricately embroidered kurtas to signature oud fragrances,
                  every item embodies our commitment to quality and authenticity.
                  We source only the finest materials and work with skilled craftsmen
                  who share our passion for excellence.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-[#2a2a2e]/50">
                <div>
                  <p className="font-display text-3xl text-[#c9b89a]">10K+</p>
                  <p className="text-sm text-[#6b6b6b] mt-1">Happy Customers</p>
                </div>
                <div>
                  <p className="font-display text-3xl text-[#c9b89a]">500+</p>
                  <p className="text-sm text-[#6b6b6b] mt-1">Unique Products</p>
                </div>
                <div>
                  <p className="font-display text-3xl text-[#c9b89a]">50+</p>
                  <p className="text-sm text-[#6b6b6b] mt-1">Artisan Partners</p>
                </div>
              </div>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 mt-8 text-[#c9b89a] hover:text-[#d4c9a8] transition-colors group"
              >
                Explore Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="relative py-24 bg-[#0c0c0e]">
        <div className="max-w-350 mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#c9b89a] text-sm tracking-[0.3em] uppercase">@kiswaessentials</span>
            <h2 className="font-display text-3xl text-[#f8f4ef] mt-2">Follow Our Journey</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-[#1a1a1e] border border-[#2a2a2e] overflow-hidden group cursor-pointer hover:border-[#c9b89a]/30 transition-colors"
              >
                <div className="w-full h-full flex items-center justify-center text-[#6b6b6b] group-hover:text-[#c9b89a] transition-colors">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <circle cx="18" cy="6" r="1.5" fill="currentColor" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
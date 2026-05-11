import { Link } from 'react-router-dom';
import { Sparkles, Star, Award, Users, Heart, Truck, Shield, RotateCcw, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  const team = [
    { name: 'Haseeb Tariq', role: 'Founder & CEO', image: 'HT' },
    { name: 'Ayesha Malik', role: 'Creative Director', image: 'AM' },
    { name: 'Bilal Ahmed', role: 'Head of Operations', image: 'BA' },
    { name: 'Fatima Khan', role: 'Lead Designer', image: 'FK' },
  ];

  const values = [
    { icon: Award, title: 'Premium Quality', description: 'Every piece is crafted with the finest materials and attention to detail.' },
    { icon: Heart, title: 'Heritage Inspired', description: 'Designs rooted in centuries of South Asian craftsmanship and tradition.' },
    { icon: Star, title: 'Timeless Elegance', description: 'Classic aesthetics that transcend seasons and trends.' },
  ];

  const stats = [
    { value: '10,000+', label: 'Happy Customers' },
    { value: '500+', label: 'Unique Products' },
    { value: '50+', label: 'Artisan Partners' },
    { value: '4.9/5', label: 'Average Rating' },
  ];

  const policies = [
    { icon: Truck, title: 'Free Shipping', description: 'Complimentary delivery on orders over £75. Worldwide shipping available.' },
    { icon: Shield, title: 'Secure Payment', description: 'SSL encrypted checkout. Multiple payment options including Apple Pay & Google Pay.' },
    { icon: RotateCcw, title: 'Easy Returns', description: '30-day hassle-free returns. Customer satisfaction is our priority.' },
  ];

  return (
    <div className="min-h-screen bg-[#0c0c0e] pt-20">
      {/* Hero Section */}
      <section id="about" className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 pattern-arabesque opacity-10" />
        <div className="absolute top-1/4 right-0 w-150 h-150 bg-[#c9b89a]/5 rounded-full blur-3xl" />

        <div className="relative max-w-350 mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center animate-fadeInUp">
            <span className="inline-flex items-center gap-2 text-[#c9b89a] text-sm tracking-[0.3em] uppercase mb-6">
              <Sparkles className="w-4 h-4" />
              Our Story
            </span>
            <h1 className="font-display text-4xl lg:text-6xl text-[#f8f4ef] mb-6 leading-tight">
              Crafting Elegance Since <span className="text-gradient-gold">2020</span>
            </h1>
            <p className="text-lg text-[#6b6b6b] leading-relaxed">
              Kiswa Essentials was born from a passion to preserve and celebrate the rich heritage of South Asian fashion.
              We believe that traditional craftsmanship deserves a modern home.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-24 bg-[#0a0a0c]">
        <div className="max-w-350 mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fadeIn">
              <div className="relative">
                <div className="aspect-4/5 rounded-3xl bg-linear-to-br from-[#1a1a1e] to-[#2a2a2e] overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 rounded-full bg-[#c9b89a]/10 mx-auto mb-6 flex items-center justify-center">
                        <Sparkles className="w-16 h-16 text-[#c9b89a]/50" />
                      </div>
                      <p className="text-[#6b6b6b]">Our Heritage</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 w-32 h-32 border border-[#c9b89a]/20 rounded-2xl" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 border border-[#c9b89a]/20 rounded-2xl" />
              </div>
            </div>

            <div className="animate-fadeInUp">
              <span className="text-[#c9b89a] text-sm tracking-[0.3em] uppercase">Our Mission</span>
              <h2 className="font-display text-3xl lg:text-4xl text-[#f8f4ef] mt-4 mb-6">
                Bridging Heritage with <span className="text-gradient-gold">Modernity</span>
              </h2>
              <div className="space-y-6 text-[#6b6b6b] leading-relaxed">
                <p>
                  At Kiswa Essentials, we curate the finest selection of traditional South Asian attire and premium fragrances.
                  Each piece in our collection tells a story of generations of artisans whose dedication has been passed down through families.
                </p>
                <p>
                  From intricately embroidered kurtas to signature oud fragrances, every item embodies our commitment to quality and authenticity.
                  We source only the finest materials and work with skilled craftsmen who share our passion for excellence.
                </p>
                <p>
                  Our mission is simple: to bring the elegance and craftsmanship of South Asian fashion to the modern world,
                  making it accessible to everyone who appreciates timeless beauty.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 bg-[#0c0c0e]">
        <div className="max-w-350 mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                <p className="font-display text-3xl lg:text-4xl text-[#c9b89a] mb-2">{stat.value}</p>
                <p className="text-sm text-[#6b6b6b]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-24 bg-[#0a0a0c]">
        <div className="absolute inset-0 pattern-arabesque opacity-10" />
        <div className="relative max-w-350 mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeInUp">
            <span className="text-[#c9b89a] text-sm tracking-[0.3em] uppercase">Our Values</span>
            <h2 className="font-display text-3xl lg:text-4xl text-[#f8f4ef] mt-4">What We Stand For</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:border-[#c9b89a]/30"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#c9b89a]/10 mb-6 group-hover:bg-[#c9b89a]/20 transition-colors">
                  <value.icon className="w-8 h-8 text-[#c9b89a]" />
                </div>
                <h3 className="font-display text-xl text-[#f8f4ef] mb-3">{value.title}</h3>
                <p className="text-sm text-[#6b6b6b]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-24 bg-[#0c0c0e]">
        <div className="max-w-350 mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeInUp">
            <span className="text-[#c9b89a] text-sm tracking-[0.3em] uppercase">Meet The Team</span>
            <h2 className="font-display text-3xl lg:text-4xl text-[#f8f4ef] mt-4">The People Behind Kiswa</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="group text-center animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-linear-to-br from-[#c9b89a] to-[#a89878] flex items-center justify-center">
                  <span className="text-[#0c0c0e] text-2xl font-display">{member.image}</span>
                </div>
                <h3 className="font-display text-lg text-[#f8f4ef] mb-1">{member.name}</h3>
                <p className="text-sm text-[#6b6b6b]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policies Section */}
      <section className="relative py-24 bg-[#0a0a0c]">
        <div className="max-w-350 mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeInUp">
            <span className="text-[#c9b89a] text-sm tracking-[0.3em] uppercase">Customer Promise</span>
            <h2 className="font-display text-3xl lg:text-4xl text-[#f8f4ef] mt-4">Shop With Confidence</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {policies.map((policy, index) => (
              <div
                key={index}
                className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-6 animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <policy.icon className="w-8 h-8 text-[#c9b89a] mb-4" />
                <h3 className="font-display text-lg text-[#f8f4ef] mb-2">{policy.title}</h3>
                <p className="text-sm text-[#6b6b6b]">{policy.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-linear-to-b from-[#0c0c0e] to-[#0a0a0c]">
        <div className="max-w-350 mx-auto px-6 lg:px-8">
          <div className="text-center animate-fadeInUp">
            <h2 className="font-display text-3xl lg:text-4xl text-[#f8f4ef] mb-6">
              Ready to Explore Our Collection?
            </h2>
            <p className="text-[#6b6b6b] mb-8 max-w-xl mx-auto">
              Discover the perfect blend of tradition and elegance. Start shopping today and experience the Kiswa difference.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#c9b89a] text-[#0c0c0e] font-medium rounded-full hover:bg-[#d4c9a8] transition-all group"
            >
              Shop Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

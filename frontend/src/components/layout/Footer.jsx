import { Link } from 'react-router-dom';
import { Sparkles, Mail, Phone, MapPin, ArrowRight, Globe } from 'lucide-react';

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: 'All Products', path: '/products' },
      { name: 'Kurtas', path: '/products?category=kurtas' },
      { name: 'Shalwar Kameez', path: '/products?category=shalwar-kameez' },
      { name: 'Shawls', path: '/products?category=shawls' },
      { name: 'Perfumes', path: '/products?category=perfumes' },
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Careers', path: '/careers' },
    ],
    support: [
      { name: 'FAQ', path: '/faq' },
      { name: 'Shipping', path: '/shipping' },
      { name: 'Returns', path: '/returns' },
      { name: 'Size Guide', path: '/size-guide' },
    ],
  };

  const socialLinks = [
    { icon: InstagramIcon, href: 'https://www.instagram.com/haseebtariq_mht/', label: 'Instagram' },
    { icon: FacebookIcon, href: 'https://www.facebook.com/kiswaessentials', label: 'Facebook' },
    { icon: TwitterIcon, href: 'https://twitter.com/kiswaessentials', label: 'Twitter' },
  ];

  return (
    <footer className="relative bg-[#0a0a0c] border-t border-[#2a2a2e]/30">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 pattern-arabesque opacity-30" />

      {/* Newsletter Section */}
      <div className="relative border-b border-[#2a2a2e]/30">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 text-[#c9b89a] text-sm tracking-[0.3em] uppercase mb-4">
              <Sparkles className="w-4 h-4" />
              Newsletter
            </span>
            <h2 className="font-display text-3xl lg:text-4xl text-[#f8f4ef] mb-4">
              Stay in the Loop
            </h2>
            <p className="text-[#6b6b6b] mb-8">
              Subscribe to receive exclusive offers, new arrivals, and style inspiration.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b]" />
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full pl-12 pr-4 py-4 bg-[#1a1a1e] border border-[#2a2a2e] rounded-full text-[#f8f4ef] placeholder-[#6b6b6b] focus:outline-none focus:border-[#c9b89a]/50 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-[#c9b89a] text-[#0c0c0e] font-medium rounded-full hover:bg-[#d4c9a8] transition-all group"
              >
                Subscribe
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-[#c9b89a]" />
              <span className="font-display text-xl tracking-[0.25em] text-[#f8f4ef]">KISWA</span>
              <span className="font-light text-xl tracking-[0.15em] text-[#c9b89a]/70">ESSENTIALS</span>
            </Link>
            <p className="text-[#6b6b6b] leading-relaxed mb-8 max-w-sm">
              Crafting premium South Asian fashion since 2020. Each piece tells a story of heritage,
              artisanship, and timeless elegance.
            </p>
            <div className="space-y-4">
              <a href="mailto:hello@kiswaessentials.com" className="flex items-center gap-3 text-sm text-[#a8a4a0] hover:text-[#c9b89a] transition-colors">
                <Mail className="w-4 h-4" />
                hello@kiswaessentials.com
              </a>
              <a href="tel:+441234567890" className="flex items-center gap-3 text-sm text-[#a8a4a0] hover:text-[#c9b89a] transition-colors">
                <Phone className="w-4 h-4" />
                +44 123 456 7890
              </a>
              <div className="flex items-start gap-3 text-sm text-[#a8a4a0]">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>London, United Kingdom</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-display text-sm tracking-[0.2em] uppercase text-[#f8f4ef] mb-6">Shop</h4>
            <ul className="space-y-4">
              {footerLinks.shop.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-[#6b6b6b] hover:text-[#c9b89a] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display text-sm tracking-[0.2em] uppercase text-[#f8f4ef] mb-6">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-[#6b6b6b] hover:text-[#c9b89a] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-display text-sm tracking-[0.2em] uppercase text-[#f8f4ef] mb-6">Support</h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-[#6b6b6b] hover:text-[#c9b89a] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#2a2a2e]/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-[#6b6b6b]">
              © {currentYear} Kiswa Essentials. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 text-[#6b6b6b] hover:text-[#c9b89a] transition-colors"
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
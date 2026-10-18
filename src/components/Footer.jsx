import React from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Heart,
  Gem,
  Sparkles,
  ShieldCheck,
  Truck,
  CreditCard,
  ArrowRight,
  MessageCircle
} from 'lucide-react';

function InstagramIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-10 border-t border-slate-900 relative overflow-hidden">
      
      {/* Decorative ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-r from-violet-600/10 via-amber-500/10 to-violet-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* VIP Collector Newsletter & Custom Order Banner */}
        <div className="mb-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-violet-900/60 via-slate-900/90 to-indigo-950/80 border border-violet-500/20 backdrop-blur-md relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Join Our Collector Family</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
                Get Exclusive First Access to New Drops
              </h3>
              <p className="mt-2 text-slate-300 text-sm leading-relaxed">
                Receive secret discount codes, seasonal collection previews, and custom gift inspiration straight to your inbox.
              </p>
            </div>

            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 min-w-[260px] sm:min-w-[300px]"
              />
              <button
                type="button"
                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-400/20 hover:scale-105 active:scale-95"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* 4 Pillars Trust Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-14 border-b border-slate-800/80 mb-14 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-900/50 border border-violet-700/50 flex items-center justify-center text-violet-300 shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">100% Handcrafted</p>
              <p className="text-xs text-slate-400">Made with artistic love</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-900/50 border border-violet-700/50 flex items-center justify-center text-violet-300 shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Premium Epoxy</p>
              <p className="text-xs text-slate-400">UV-proof non-yellowing</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-900/50 border border-violet-700/50 flex items-center justify-center text-violet-300 shrink-0">
              <Truck className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Safe Delivery</p>
              <p className="text-xs text-slate-400">Shockproof packaging</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-900/50 border border-violet-700/50 flex items-center justify-center text-violet-300 shrink-0">
              <CreditCard className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Secure Checkout</p>
              <p className="text-xs text-slate-400">UPI, Cards & NetBanking</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 text-white group">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xs border border-white/20 shrink-0 bg-white">
                <img
                  src="/images/logo.jpg"
                  alt="Khushi Resin Creations Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold font-serif tracking-tight text-white">
                  Khushi Resin
                </span>
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold -mt-1">
                  Handcrafted Creations
                </span>
              </div>
            </Link>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              We specialize in immortalizing precious memories through museum-grade resin artistry. Every piece is unique, hand-poured, and personalized to tell your story.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a 
                href="https://instagram.com/newkhushiresincreations" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-gradient-to-tr hover:from-amber-500 hover:to-pink-600 hover:text-white text-slate-300 flex items-center justify-center transition-all border border-white/10"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://wa.me/919876543210" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-emerald-600 hover:text-white text-slate-300 flex items-center justify-center transition-all border border-white/10"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: 'Home', path: '/' },
                { name: 'All Products', path: '/products' },
                { name: 'About Studio', path: '/about' },
                { name: 'Contact Us', path: '/contact' },
                { name: 'Admin Login', path: '/admin/login' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className="text-slate-400 hover:text-amber-300 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Collections
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: 'Resin Keychains', slug: 'resin-keychains' },
                { name: 'Resin Jewelry & Pendants', slug: 'resin-jewelry' },
                { name: 'Preserved Photo Frames', slug: 'resin-photo-frames' },
                { name: 'Custom Geode Nameplates', slug: 'resin-nameplates' },
                { name: 'Custom Varmala & Clocks', slug: 'custom-items' },
                { name: 'Festival Pooja Thalis', slug: 'festival-special' },
              ].map((category) => (
                <li key={category.slug}>
                  <Link href={`/categories/${category.slug}`} className="text-slate-400 hover:text-amber-300 transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Support (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Direct Support
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a 
                  href="https://wa.me/919876543210" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-start gap-3 text-slate-300 hover:text-white transition-colors group"
                >
                  <Phone className="w-4 h-4 mt-1 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-xs text-slate-400">WhatsApp / Call</p>
                    <p className="text-sm font-semibold text-white">+91 98765 43210</p>
                  </div>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:hello@khushiresin.com" 
                  className="flex items-start gap-3 text-slate-300 hover:text-white transition-colors group"
                >
                  <Mail className="w-4 h-4 mt-1 text-violet-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-xs text-slate-400">Email Address</p>
                    <p className="text-sm font-semibold text-white">hello@khushiresin.com</p>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <MapPin className="w-4 h-4 mt-1 text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Studio Location</p>
                  <p className="text-sm text-white">Mumbai, Maharashtra, India</p>
                  <p className="text-xs text-slate-400">Pan-India & Worldwide Shipping</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} New Khushi Resin Creations. All rights reserved. Handcrafted with passion.
          </p>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Handmade with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current animate-pulse" />
            <span>& Non-Yellowing Crystal Epoxy</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

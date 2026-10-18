'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Gem,
  Menu,
  X,
  ShoppingBag,
  Search,
  ChevronDown,
  User,
  KeyRound,
  Frame,
  Home as HomeIcon,
  Palette,
  Gift,
  ArrowRight,
  MessageCircle,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/components/CartProvider';

const categories = [
  { name: 'Resin Keychains', slug: 'resin-keychains', icon: KeyRound, desc: 'Personalized letters & charms' },
  { name: 'Resin Jewelry', slug: 'resin-jewelry', icon: Gem, desc: 'Real dried florals & gold flake' },
  { name: 'Photo Frames', slug: 'resin-photo-frames', icon: Frame, desc: 'Cherished memories preserved' },
  { name: 'Nameplates', slug: 'resin-nameplates', icon: HomeIcon, desc: 'Agate & gold geode home decor' },
  { name: 'Custom Items', slug: 'custom-items', icon: Palette, desc: 'Varmala, clocks & bespoke' },
  { name: 'Festival Special', slug: 'festival-special', icon: Gift, desc: 'Pooja thalis & holiday sets' },
];

export default function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(false);
  
  const pathname = usePathname();
  const { getCartCount, isLoaded } = useCart();
  const cartCount = isLoaded ? getCartCount() : 0;

  useEffect(() => {
    // Check initial dark mode from DOM or localStorage
    const isDarkMode = document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-violet-950 via-violet-900 to-indigo-950 text-white text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 border-b border-violet-800/40 relative z-50">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse hidden sm:inline" />
        <span>✨ Handcrafted Luxury Resin Art · Free Shipping on Orders Over ₹999 · Custom Orders Welcome</span>
      </div>

      <header 
        className={cn(
          'sticky top-0 inset-x-0 z-40 transition-all duration-300',
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-violet-100/80 py-3' 
            : 'bg-white/90 backdrop-blur-sm border-b border-gray-100 py-3.5 md:py-4'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xs border border-violet-100/80 group-hover:scale-105 transition-transform duration-300 shrink-0 bg-white">
                <img
                  src="/images/logo.jpg"
                  alt="Khushi Resin Creations Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold font-serif tracking-tight text-gray-900 group-hover:text-violet-700 transition-colors">
                  Khushi Resin
                </span>
                <span className="text-[10px] uppercase tracking-widest text-violet-600 font-semibold -mt-1">
                  Handcrafted Studio
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-7">
              <Link 
                href="/"
                className={cn(
                  "text-sm font-semibold transition-colors hover:text-violet-600 py-1 relative",
                  pathname === '/' ? "text-violet-700 font-bold" : "text-gray-700"
                )}
              >
                Home
                {pathname === '/' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full" />
                )}
              </Link>

              <Link 
                href="/products"
                className={cn(
                  "text-sm font-semibold transition-colors hover:text-violet-600 py-1 relative",
                  pathname === '/products' ? "text-violet-700 font-bold" : "text-gray-700"
                )}
              >
                Products
                {pathname === '/products' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full" />
                )}
              </Link>

              {/* Categories Mega Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                <button className={cn(
                  "flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-violet-600 py-1",
                  pathname.includes('/categories') ? "text-violet-700 font-bold" : "text-gray-700"
                )}>
                  <span>Categories</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", showCategories && "rotate-180")} />
                </button>

                {/* Dropdown Menu */}
                <div className={cn(
                  "absolute top-full left-1/2 -translate-x-1/2 w-80 bg-white rounded-2xl shadow-xl border border-violet-100 p-2.5 transition-all duration-200 origin-top z-50",
                  showCategories ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
                )}>
                  <div className="grid grid-cols-1 gap-1">
                    {categories.map((cat) => {
                      const CatIcon = cat.icon;
                      return (
                        <Link
                          key={cat.slug}
                          href={`/categories/${cat.slug}`}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-violet-50 group/item transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-violet-100/80 text-violet-700 flex items-center justify-center group-hover/item:bg-violet-600 group-hover/item:text-white transition-colors shadow-xs">
                            <CatIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold text-gray-900 group-hover/item:text-violet-700 transition-colors">
                              {cat.name}
                            </p>
                            <p className="text-[11px] text-gray-500 line-clamp-1">
                              {cat.desc}
                            </p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover/item:text-violet-600 group-hover/item:translate-x-0.5 transition-all" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              <Link 
                href="/about"
                className={cn(
                  "text-sm font-semibold transition-colors hover:text-violet-600 py-1 relative",
                  pathname === '/about' ? "text-violet-700 font-bold" : "text-gray-700"
                )}
              >
                About
                {pathname === '/about' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full" />
                )}
              </Link>

              <Link 
                href="/contact"
                className={cn(
                  "text-sm font-semibold transition-colors hover:text-violet-600 py-1 relative",
                  pathname === '/contact' ? "text-violet-700 font-bold" : "text-gray-700"
                )}
              >
                Contact
                {pathname === '/contact' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full" />
                )}
              </Link>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Search Toggle */}
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-9 h-9 rounded-full hover:bg-violet-50 text-gray-700 hover:text-violet-700 flex items-center justify-center transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
              
              {/* Cart Button */}
              <Link 
                href="/cart" 
                className="relative w-9 h-9 rounded-full hover:bg-violet-50 text-gray-700 hover:text-violet-700 flex items-center justify-center transition-colors" 
                aria-label="Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {/* WhatsApp Quick Order Pill */}
              <a 
                href="https://wa.me/919876543210?text=Hi!%20I'm%20interested%20in%20custom%20resin%20creations."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold transition-all shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-current" />
                <span>Custom Order</span>
              </a>

              {/* Light / Dark Mode Toggle Switch */}
              <button
                onClick={toggleTheme}
                type="button"
                className="relative inline-flex h-7 w-13 shrink-0 cursor-pointer items-center rounded-full border border-violet-200 dark:border-violet-500/40 bg-violet-100/80 dark:bg-slate-800 p-0.5 transition-colors duration-300 focus:outline-none shadow-inner"
                aria-label="Toggle theme"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                <Sun className={cn(
                  "absolute left-1.5 w-3 h-3 text-amber-500 transition-opacity duration-200 pointer-events-none",
                  isDark ? "opacity-25" : "opacity-100"
                )} />
                <Moon className={cn(
                  "absolute right-1.5 w-3 h-3 text-violet-300 transition-opacity duration-200 pointer-events-none",
                  isDark ? "opacity-100" : "opacity-25"
                )} />
                <span
                  className={cn(
                    "pointer-events-none flex h-5.5 w-5.5 transform items-center justify-center rounded-full bg-white dark:bg-violet-600 shadow-md transition-transform duration-300 ease-in-out",
                    isDark ? "translate-x-6 text-white" : "translate-x-0 text-amber-500"
                  )}
                >
                  {isDark ? (
                    <Moon className="w-3 h-3 fill-current" />
                  ) : (
                    <Sun className="w-3 h-3 fill-current" />
                  )}
                </span>
              </button>

              {/* Admin Link */}
              <Link 
                href="/admin" 
                className="hidden md:flex w-9 h-9 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 items-center justify-center transition-colors" 
                aria-label="Admin"
              >
                <User className="w-4 h-4" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden w-9 h-9 rounded-lg hover:bg-violet-50 text-gray-700 flex items-center justify-center"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Dropdown Modal */}
        {searchOpen && (
          <div className="absolute top-full inset-x-0 bg-white border-b border-violet-100 shadow-lg p-4 transition-all z-40">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search keychains, jewelry, photo frames, nameplates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-xs"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2.5 text-gray-400 hover:text-gray-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Sidebar */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity duration-300",
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )} 
        onClick={() => setMobileMenuOpen(false)} 
      />

      <div 
        className={cn(
          "fixed top-0 right-0 bottom-0 w-[300px] bg-white z-50 shadow-2xl md:hidden flex flex-col transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-violet-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-violet-100 bg-white shadow-xs">
              <img
                src="/images/logo.jpg"
                alt="Khushi Resin Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold font-serif text-gray-900 leading-tight">Khushi Resin</span>
              <span className="text-[9px] uppercase tracking-wider text-violet-600 font-semibold">Studio</span>
            </div>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-800 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 py-4">
          <nav className="flex flex-col space-y-1 px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                  pathname === link.path ? "bg-violet-50 text-violet-700" : "text-gray-700 hover:bg-gray-50"
                )}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 pb-2 px-4">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Collections</span>
            </div>
            
            {categories.map((cat) => {
              const CatIcon = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2.5",
                    pathname === `/categories/${cat.slug}` ? "bg-violet-50 text-violet-700 font-semibold" : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <CatIcon className="w-4 h-4 text-violet-500" />
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-violet-900/40 bg-gray-50/70 dark:bg-slate-900/80 space-y-3">
          {/* Mobile Theme Toggle */}
          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200/80 dark:border-violet-500/30">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              {isDark ? <Moon className="w-3.5 h-3.5 text-violet-400 fill-current" /> : <Sun className="w-3.5 h-3.5 text-amber-500 fill-current" />}
              <span>{isDark ? 'Dark Theme' : 'Light Theme'}</span>
            </span>
            <button
              onClick={toggleTheme}
              type="button"
              className="relative inline-flex h-7 w-13 shrink-0 cursor-pointer items-center rounded-full border border-violet-200 dark:border-violet-500/40 bg-violet-100/80 dark:bg-slate-700 p-0.5 transition-colors duration-300 focus:outline-none shadow-inner"
              aria-label="Toggle theme"
            >
              <Sun className={cn(
                "absolute left-1.5 w-3 h-3 text-amber-500 transition-opacity duration-200 pointer-events-none",
                isDark ? "opacity-25" : "opacity-100"
              )} />
              <Moon className={cn(
                "absolute right-1.5 w-3 h-3 text-violet-300 transition-opacity duration-200 pointer-events-none",
                isDark ? "opacity-100" : "opacity-25"
              )} />
              <span
                className={cn(
                  "pointer-events-none flex h-5.5 w-5.5 transform items-center justify-center rounded-full bg-white dark:bg-violet-600 shadow-md transition-transform duration-300 ease-in-out",
                  isDark ? "translate-x-6 text-white" : "translate-x-0 text-amber-500"
                )}
              >
                {isDark ? (
                  <Moon className="w-3 h-3 fill-current" />
                ) : (
                  <Sun className="w-3 h-3 fill-current" />
                )}
              </span>
            </button>
          </div>

          <a
            href="https://wa.me/919876543210?text=Hi!%20I'm%20interested%20in%20custom%20resin%20creations."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-xs"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Chat on WhatsApp</span>
          </a>
          <Link href="/admin" className="flex items-center justify-center gap-2 py-2 text-xs font-medium text-gray-500 hover:text-violet-600">
            <User className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>
    </>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gem, Menu, X, ShoppingCart, Search, ChevronDown, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/components/CartProvider';

const categories = [
  { name: 'Resin Keychains', slug: 'resin-keychains' },
  { name: 'Resin Jewelry', slug: 'resin-jewelry' },
  { name: 'Photo Frames', slug: 'photo-frames' },
  { name: 'Nameplates', slug: 'nameplates' },
  { name: 'Custom Items', slug: 'custom-items' },
  { name: 'Festival Special', slug: 'festival-special' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  
  const pathname = usePathname();
  const { getCartCount, isLoaded } = useCart();
  const cartCount = isLoaded ? getCartCount() : 0;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header 
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' 
            : 'bg-white py-4 md:py-5'
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group z-50">
              <div className="bg-violet-100 p-1.5 rounded-lg group-hover:bg-violet-200 transition-colors">
                <Gem className="w-6 h-6 text-violet-600 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-indigo-700 tracking-tight">
                Khushi Resin
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {/* Home, Products */}
              {navLinks.slice(0, 2).map((link) => (
                <Link 
                  key={link.name} 
                  href={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-violet-600",
                    pathname === link.path ? "text-violet-600" : "text-gray-600"
                  )}
                >
                  {link.name}
                </Link>
              ))}

              {/* Categories Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                <button className={cn(
                  "flex items-center gap-1 text-sm font-medium transition-colors hover:text-violet-600 py-2",
                  pathname.includes('/categories') ? "text-violet-600" : "text-gray-600"
                )}>
                  Categories
                  <ChevronDown className={cn("w-4 h-4 transition-transform", showCategories && "rotate-180")} />
                </button>

                {/* Dropdown Menu */}
                <div className={cn(
                  "absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 transition-all duration-200 origin-top",
                  showCategories ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
                )}>
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categories/${cat.slug}`}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* About, Contact */}
              {navLinks.slice(2).map((link) => (
                <Link 
                  key={link.name} 
                  href={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-violet-600",
                    pathname === link.path ? "text-violet-600" : "text-gray-600"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-3 md:gap-5 z-50">
              <button className="text-gray-600 hover:text-violet-600 transition-colors p-1" aria-label="Search">
                <Search className="w-5 h-5" />
              </button>
              
              <Link href="/cart" className="relative text-gray-600 hover:text-violet-600 transition-colors p-1" aria-label="Cart">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              <Link href="/admin" className="hidden md:flex text-gray-400 hover:text-gray-600 transition-colors p-1" aria-label="Admin">
                <User className="w-4 h-4" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden text-gray-600 p-1"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300",
        mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
      )} onClick={() => setMobileMenuOpen(false)}></div>

      <div className={cn(
        "fixed top-0 right-0 bottom-0 w-[280px] bg-white z-50 shadow-2xl md:hidden flex flex-col transition-transform duration-300 ease-in-out",
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <span className="font-bold text-lg text-violet-900">Menu</span>
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
                  "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                  pathname === link.path ? "bg-violet-50 text-violet-700" : "text-gray-700 hover:bg-gray-50"
                )}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 pb-2 px-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categories</span>
            </div>
            
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className={cn(
                  "px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                  pathname === `/categories/${cat.slug}` ? "bg-violet-50 text-violet-700" : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-violet-300"></div>
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50">
          <Link href="/admin" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-violet-600">
            <User className="w-4 h-4" />
            Admin Login
          </Link>
        </div>
      </div>
    </>
  );
}

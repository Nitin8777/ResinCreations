'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { Loader2, Search, SlidersHorizontal, Sparkles, X, PackageOpen } from 'lucide-react';

const categories = [
  { name: 'All Collections', slug: 'all' },
  { name: 'Keychains', slug: 'resin-keychains' },
  { name: 'Jewelry', slug: 'resin-jewelry' },
  { name: 'Photo Frames', slug: 'resin-photo-frames' },
  { name: 'Nameplates', slug: 'resin-nameplates' },
  { name: 'Custom Art', slug: 'custom-items' },
  { name: 'Festival Special', slug: 'festival-special' }
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [urlSearch]);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const categoryQuery = activeCategory !== 'all' ? `&category=${encodeURIComponent(activeCategory)}` : '';
        const res = await fetch(`/api/products?limit=100${categoryQuery}`);
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [activeCategory]);

  // Client-side text filter for search query
  const filteredProducts = products.filter(product => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = product.name?.toLowerCase().includes(q);
    const descMatch = product.description?.toLowerCase().includes(q);
    const catMatch = product.category?.toLowerCase().includes(q);
    const tagsMatch = Array.isArray(product.tags) && product.tags.some(t => t.toLowerCase().includes(q));
    return nameMatch || descMatch || catMatch || tagsMatch;
  });

  // Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;
    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Artisan Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 font-serif tracking-tight">
            Our Handcrafted Creations
          </h1>
          <p className="mt-2.5 text-gray-600 text-sm sm:text-base leading-relaxed">
            Every piece is made to order with crystal epoxy resin, botanical flora, and personalized accents.
          </p>
        </div>

        {/* Controls Container */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] mb-10 space-y-5">
          
          {/* Top Row: Search & Sort */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, floral, alphabet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 text-gray-800 placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Sort:</span>
              </div>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Category Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
            {categories.map(cat => {
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-violet-600 text-white shadow-xs' 
                      : 'bg-gray-50 text-gray-600 hover:bg-violet-50 hover:text-violet-700 border border-transparent'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'creation' : 'creations'}
          </p>
          {(activeCategory !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-violet-600 hover:text-violet-800 underline underline-offset-4"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
            <p className="text-gray-500 text-sm font-medium">Loading creations from atelier...</p>
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-7">
            {sortedProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto mb-4">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 font-serif mb-2">No creations matched your criteria</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              Try searching with another keyword or reset the category filter to explore all available items.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 rounded-full bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors shadow-xs"
            >
              Show All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}

'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Loader2 } from 'lucide-react';

const categories = [
  { name: 'All', slug: 'all' },
  { name: 'Keychains', slug: 'resin-keychains' },
  { name: 'Jewelry', slug: 'resin-jewelry' },
  { name: 'Photo Frames', slug: 'resin-photo-frames' },
  { name: 'Nameplates', slug: 'resin-nameplates' },
  { name: 'Custom', slug: 'custom-items' },
  { name: 'Festival', slug: 'festival-special' }
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const categoryQuery = activeCategory !== 'all' ? `&category=${encodeURIComponent(activeCategory)}` : '';
        const res = await fetch(`/api/products?limit=100${categoryQuery}`);
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        } else if (activeCategory === 'all') {
          // If DB returned empty for all, fetch again or keep empty
          setProducts(data.products || []);
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

  // Sort
  const sortedProducts = [...products].sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;
    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-violet-900 mb-8 font-serif text-center md:text-left">Our Products</h1>
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {categories.map(cat => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat.slug ? 'bg-violet-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-violet-100 border border-gray-200'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 outline-none focus:ring-2 focus:ring-violet-500 shadow-sm"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
            <p className="text-gray-500 text-sm font-medium">Loading handcrafted resin creations...</p>
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {sortedProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8">
            <p className="text-4xl mb-4">🔍</p>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 text-sm">Try changing your category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

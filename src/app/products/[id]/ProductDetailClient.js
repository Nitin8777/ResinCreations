'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/components/CartProvider';

export function ProductDetailClient({ product, relatedProducts }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState('');
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const price = product.discountPrice || product.price;

  // Extract images safely
  const rawImages = Array.isArray(product.images) && product.images.length > 0 ? product.images : [{ url: '/images/placeholder.svg' }];
  const images = rawImages.map(img => typeof img === 'string' ? img : (img?.url || '/images/placeholder.svg'));
  
  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play loop when there are multiple photos - runs continuously without stopping
  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 2800); // changes photo every 2.8 seconds automatically in a continuous non-stop loop

    return () => clearInterval(timer);
  }, [images.length]);

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % images.length);
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity, customText });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const generateWhatsAppLink = () => {
    const text = `Hi, I want to order:\n${product.name}\nQuantity: ${quantity}${customText ? `\nCustomization: ${customText}` : ''}\nPrice: ₹${price * quantity}`;
    return `https://wa.me/919876543210?text=${encodeURIComponent(text)}`;
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-violet-600">Home</Link> &gt; 
        <Link href="/products" className="hover:text-violet-600 mx-1">Products</Link> &gt; 
        <span className="text-gray-900 mx-1">{product.name}</span>
      </nav>

      <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-10">
        {/* Images Carousel Container */}
        <div className="w-full md:w-1/2">
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4 relative border border-violet-100 shadow-inner group select-none">
            {/* Stacked Images for Smooth Crossfade Loop */}
            {images.map((imgUrl, idx) => (
              <img 
                key={idx}
                src={imgUrl} 
                alt={`${product.name} photo ${idx + 1}`} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                  idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              />
            ))}

            {images.length > 1 && (
              <>
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-sm flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-105 cursor-pointer"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-sm flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-105 cursor-pointer"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Counter Badge */}
                <div className="absolute top-3 right-3 z-20 bg-black/50 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <span>{currentIndex + 1} / {images.length}</span>
                </div>

                {/* Progress Indicator Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentIndex 
                          ? 'w-5 bg-[#D4AF37]' 
                          : 'w-1.5 bg-white/70 hover:bg-white'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 relative ${
                    currentIndex === idx 
                      ? 'border-violet-600 ring-2 ring-violet-200 shadow-md scale-105 opacity-100' 
                      : 'border-gray-200 hover:border-violet-300 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-semibold tracking-wide uppercase">
              {product.category ? product.category.replace('-', ' ') : 'Handmade'}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-serif">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl font-bold text-violet-700">₹{price}</span>
            {product.discountPrice && (
              <span className="text-lg text-gray-400 line-through">₹{product.price}</span>
            )}
            {product.inStock ? (
              <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded">In Stock</span>
            ) : (
              <span className="text-sm text-red-600 font-medium bg-red-50 px-2 py-1 rounded">Out of Stock</span>
            )}
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed">{product.description || 'A beautiful handcrafted resin art piece.'}</p>

          {/* Customization */}
          <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">Personalize (Optional)</label>
            <input 
              type="text" 
              placeholder="Name, date, or colors..." 
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <div className="flex items-center border border-gray-300 rounded-lg h-12 w-32">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg">-</button>
              <span className="flex-1 text-center font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg">+</button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 h-12 rounded-lg font-medium transition shadow-sm ${added ? 'bg-green-600 text-white' : 'bg-violet-600 hover:bg-violet-700 text-white disabled:bg-gray-300'}`}
            >
              {added ? 'Added to Cart!' : 'Add to Cart'}
            </button>

            <button
              onClick={() => {
                addToCart(product, quantity, { customText });
                router.push('/cart');
              }}
              disabled={!product.inStock}
              className="flex-1 h-12 rounded-lg font-medium transition shadow-sm bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-amber-600 hover:to-amber-700 text-white disabled:bg-gray-300 flex items-center justify-center gap-1.5"
            >
              Buy Now (Razorpay)
            </button>
          </div>
          
          <a 
            href={generateWhatsAppLink()} 
            target="_blank" 
            rel="noreferrer"
            className="mt-4 w-full h-12 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd5c] text-white rounded-lg font-medium transition shadow-sm"
          >
            <span>💬</span> Order on WhatsApp
          </a>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts?.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

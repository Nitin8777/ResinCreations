'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  CreditCard,
  MessageCircle,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle2,
  Star
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/components/CartProvider';

export function ProductDetailClient({ product, relatedProducts }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState('');
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const price = product.discountPrice || product.price;

  // Extract images safely and prioritize real custom photos over placeholder
  const rawImages = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : (product.image ? [product.image] : [{ url: '/images/placeholder.svg' }]);

  const extracted = rawImages
    .map(img => (typeof img === 'string' ? img : (img?.url || '')))
    .filter(url => url && typeof url === 'string' && url.trim().length > 0);

  const realImages = extracted.filter(url => !url.includes('placeholder.svg'));
  const images = realImages.length > 0 ? realImages : (extracted.length > 0 ? extracted : ['/images/placeholder.svg']);
  
  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index whenever images change
  useEffect(() => {
    setCurrentIndex(0);
  }, [product._id, images[0]]);

  // Auto-play loop when there are multiple photos
  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 3200);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-violet-600 transition-colors">Home</Link>
        <span className="text-gray-300">/</span>
        <Link href="/products" className="hover:text-violet-600 transition-colors">Products</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-bold line-clamp-1">{product.name}</span>
      </nav>

      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col lg:flex-row gap-10 lg:gap-14">
        
        {/* Images Carousel Container */}
        <div className="w-full lg:w-1/2">
          <div className="aspect-square bg-slate-50 rounded-3xl overflow-hidden mb-4 relative border border-gray-100 shadow-inner group select-none">
            {/* Stacked Images for Smooth Crossfade Loop */}
            {images.map((imgUrl, idx) => (
              <img 
                key={`${imgUrl}-${idx}`}
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
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-md flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-105 cursor-pointer"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-md flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-105 cursor-pointer"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Counter Badge */}
                <div className="absolute top-3.5 right-3.5 z-20 bg-black/50 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <span>{currentIndex + 1} / {images.length}</span>
                </div>

                {/* Progress Indicator Dots */}
                <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/35 backdrop-blur-md px-3 py-1 rounded-full">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentIndex 
                          ? 'w-5 bg-amber-400' 
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
                  key={`${imgUrl}-${idx}`}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 relative ${
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

        {/* Info Column */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2.5">
              <span className="inline-block px-3 py-1 bg-violet-100/80 text-violet-700 rounded-full text-[11px] font-bold tracking-wider uppercase">
                {product.category ? product.category.replace('-', ' ') : 'Handcrafted Resin'}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>4.9 (Verified Artisan Piece)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 font-serif leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-gray-100">
              <span className="text-3xl font-bold text-gray-900 font-serif">₹{price}</span>
              {product.discountPrice && (
                <span className="text-lg text-gray-400 line-through">₹{product.price}</span>
              )}
              {product.inStock ? (
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  In Stock · Ready to Handcraft
                </span>
              ) : (
                <span className="text-xs text-rose-600 font-semibold bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                  Sold Out
                </span>
              )}
            </div>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
              {product.description || 'A timeless handcrafted resin art piece created with premium UV-resistant crystal epoxy.'}
            </p>

            {/* Customization Input */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                <span>Add Customization Note (Optional)</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter names, initial letter, dates, or color preference..." 
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 outline-none text-gray-800"
              />
              <p className="text-[11px] text-gray-500 mt-1.5">
                We will personalize your resin piece exactly as entered above.
              </p>
            </div>
          </div>

          {/* Actions Block */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center border border-gray-200 rounded-xl h-12 w-full sm:w-32 bg-gray-50">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-l-xl text-base font-bold"
                >
                  -
                </button>
                <span className="flex-1 text-center font-bold text-sm">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-r-xl text-base font-bold"
                >
                  +
                </button>
              </div>
              
              {/* Add to Cart button */}
              <button 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 h-12 rounded-xl text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                  added 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-violet-600 hover:bg-violet-700 text-white disabled:bg-gray-200 disabled:text-gray-400'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{added ? 'Added to Cart ✓' : 'Add to Cart'}</span>
              </button>

              {/* Instant Buy button */}
              <button
                onClick={() => {
                  addToCart(product, quantity, { customText });
                  router.push('/cart');
                }}
                disabled={!product.inStock}
                className="flex-1 h-12 rounded-xl text-sm font-semibold transition-all shadow-md bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white disabled:bg-gray-200 disabled:text-gray-400 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Buy Now</span>
              </button>
            </div>
            
            {/* WhatsApp direct order */}
            <a 
              href={generateWhatsAppLink()} 
              target="_blank" 
              rel="noreferrer"
              className="w-full h-12 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Order via WhatsApp Direct</span>
            </a>

            {/* Trust highlights */}
            <div className="grid grid-cols-2 gap-3 pt-4 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Non-Yellowing UV Epoxy</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-violet-600 shrink-0" />
                <span>Shockproof Breakage-Free Box</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Related Products */}
      {relatedProducts?.length > 0 && (
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-1">Pair It With</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">You Might Also Adore</h2>
            </div>
            <Link href="/products" className="text-sm font-semibold text-violet-600 hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

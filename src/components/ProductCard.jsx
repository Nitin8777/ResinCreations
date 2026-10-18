'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, MessageCircle, Star, Sparkles } from 'lucide-react';
import { useCart } from '@/components/CartProvider';
import { cn } from '@/lib/utils';

export default function ProductCard({ product }) {
  const { _id, name, slug, price, discountPrice, images, category, featured, bestseller, inStock = true } = product;
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  
  // Extract all valid image URLs and prioritize real uploaded photos over placeholder
  const rawList = Array.isArray(images) && images.length > 0 
    ? images 
    : (product.image ? [product.image] : ['/images/placeholder.svg']);

  const extracted = rawList
    .map(item => (typeof item === 'string' ? item : (item?.url || '')))
    .filter(url => url && typeof url === 'string' && url.trim().length > 0);

  // If there are real uploaded images, filter out placeholder.svg so real photos are always primary
  const realImages = extracted.filter(url => !url.includes('placeholder.svg'));
  const imageList = realImages.length > 0 ? realImages : (extracted.length > 0 ? extracted : ['/images/placeholder.svg']);
  
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Reset index if product or primary image changes
  useEffect(() => {
    setCurrentImgIndex(0);
  }, [_id, imageList[0]]);

  // Auto-cycle continuously in loop without needing hover
  useEffect(() => {
    if (imageList.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImgIndex(prev => (prev + 1) % imageList.length);
    }, 3200);

    return () => clearInterval(timer);
  }, [imageList.length]);

  const hasDiscount = discountPrice && discountPrice < price;
  const currentPrice = hasDiscount ? discountPrice : price;
  const discountPercent = hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (inStock) {
      addToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }
  };

  const productUrl = `/products/${slug || _id}`;

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_32px_-8px_rgba(109,40,217,0.15)] hover:border-violet-200 transition-all duration-300 overflow-hidden relative hover:-translate-y-1">
      
      {/* Floating Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
        {bestseller && (
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 backdrop-blur-xs">
            <Star className="w-3 h-3 fill-current" />
            <span>Bestseller</span>
          </span>
        )}
        {featured && !bestseller && (
          <span className="bg-violet-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs backdrop-blur-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Featured</span>
          </span>
        )}
      </div>

      {hasDiscount && inStock && (
        <div className="absolute top-3 right-3 z-10 bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
          {discountPercent}% OFF
        </div>
      )}

      {/* Image Container */}
      <Link href={productUrl} className="relative aspect-square overflow-hidden bg-slate-50 block">
        {imageList.map((imgSrc, idx) => (
          <img 
            key={`${imgSrc}-${idx}`}
            src={imgSrc} 
            alt={name}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:scale-105",
              idx === currentImgIndex ? "opacity-100 z-0" : "opacity-0 pointer-events-none",
              !inStock && "opacity-50 grayscale"
            )}
            loading="lazy"
          />
        ))}

        {/* Multi-image indicator dots */}
        {imageList.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full shadow-xs">
            {imageList.map((_, i) => (
              <span 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImgIndex ? 'bg-amber-400 w-3' : 'bg-white/60 w-1.5'}`}
              />
            ))}
          </div>
        )}

        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-xs z-10">
            <span className="bg-white/95 text-gray-900 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between mb-1.5 text-xs">
            <span className="font-semibold text-violet-600 uppercase tracking-wider text-[10px]">
              {category?.replace(/-/g, ' ')}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-medium text-[11px]">
              <Star className="w-3 h-3 fill-current" />
              <span>4.9</span>
            </div>
          </div>
          
          {/* Title */}
          <Link href={productUrl} className="block mb-2">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1 group-hover:text-violet-700 transition-colors">
              {name}
            </h3>
          </Link>
          
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-lg font-bold text-gray-900">
              ₹{currentPrice}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                ₹{price}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={cn(
              "w-full py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition-all shadow-xs",
              inStock 
                ? added 
                  ? "bg-emerald-600 text-white"
                  : "bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{inStock ? (added ? 'Added to Cart ✓' : 'Add to Cart') : 'Out of Stock'}</span>
          </button>
          
          <a 
            href={`https://wa.me/919876543210?text=Hi!%20I'm%20interested%20in%20ordering:%20${encodeURIComponent(name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-1.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-500 fill-current" />
            <span>Order on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, MessageCircle, Star } from 'lucide-react';
import { useCart } from '@/components/CartProvider';
import { cn } from '@/lib/utils';

export default function ProductCard({ product }) {
  const { _id, name, slug, price, discountPrice, images, category, featured, bestseller, inStock = true } = product;
  const { addToCart } = useCart();
  
  // Extract all valid image URLs
  const rawList = Array.isArray(images) && images.length > 0 ? images : ['/images/placeholder.svg'];
  const imageList = rawList.map(item => typeof item === 'string' ? item : (item?.url || '/images/placeholder.svg'));
  
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Auto-cycle continuously in loop without needing hover
  useEffect(() => {
    if (imageList.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImgIndex(prev => (prev + 1) % imageList.length);
    }, 3000); // changes photo every 3s in a continuous loop

    return () => clearInterval(timer);
  }, [imageList.length]);

  const hasDiscount = discountPrice && discountPrice < price;
  const currentPrice = hasDiscount ? discountPrice : price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (inStock) {
      addToCart(product);
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-xl border border-violet-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative">
      
      {/* Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
        {bestseller && (
          <span className="bg-[#D4AF37] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" /> Bestseller
          </span>
        )}
        {featured && !bestseller && (
          <span className="bg-violet-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            Featured
          </span>
        )}
      </div>

      {hasDiscount && inStock && (
        <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
          Sale
        </div>
      )}

      {/* Image Container */}
      <Link href={`/products/${slug || _id}`} className="relative aspect-square overflow-hidden bg-gray-50 block">
        {imageList.map((imgSrc, idx) => (
          <img 
            key={idx}
            src={imgSrc} 
            alt={name}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:scale-105",
              idx === currentImgIndex ? "opacity-100 z-0" : "opacity-0 pointer-events-none",
              !inStock && "opacity-50 grayscale"
            )}
          />
        ))}

        {/* Multi-image indicator dots */}
        {imageList.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
            {imageList.map((_, i) => (
              <span 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImgIndex ? 'bg-[#D4AF37] w-3.5' : 'bg-white/60 w-1.5'}`}
              />
            ))}
          </div>
        )}

        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] z-10">
            <span className="bg-white/90 text-gray-900 font-bold px-4 py-2 rounded-lg shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-1 text-xs font-medium text-violet-500 uppercase tracking-wider">
          {category}
        </div>
        
        <Link href={`/products/${slug || _id}`} className="block mb-2 flex-grow">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-violet-600 transition-colors">
            {name}
          </h3>
        </Link>
        
        <div className="flex items-end justify-between mb-4 mt-auto">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-xs text-gray-400 line-through">₹{price}</span>
                <span className="text-lg font-bold text-green-600">₹{discountPrice}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">₹{price}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={cn(
              "w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-all",
              inStock 
                ? "bg-violet-600 hover:bg-violet-700 text-white active:scale-[0.98]" 
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            )}
          >
            <ShoppingBag className="w-4 h-4" />
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
          
          <a 
            href={`https://wa.me/919876543210?text=Hi!%20I'd%20like%20to%20order:%20${encodeURIComponent(name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 flex items-center justify-center gap-1.5 text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Order
          </a>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Sparkles, MessageCircle, ShoppingBag } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-violet-900 via-violet-700 to-indigo-800 text-white min-h-[600px] flex items-center">
      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 rounded-full bg-purple-300 blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 rounded-full bg-pink-300 blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 py-16 lg:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-violet-100 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Premium Resin Art</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-violet-200">
            Handcrafted Resin Art
          </h1>
          
          <h2 className="text-xl md:text-2xl font-medium text-violet-100 mb-4">
            Unique & Beautiful Creations Made with Love
          </h2>
          
          <p className="text-lg text-violet-200 mb-10 max-w-2xl mx-auto">
            Transform your ideas into stunning resin masterpieces. From elegant keychains and jewelry to personalized nameplates and custom photo frames.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link 
              href="/products" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#C5A028] text-white font-semibold text-lg transition-all shadow-lg shadow-yellow-900/20 hover:scale-105"
            >
              <ShoppingBag className="w-5 h-5" />
              Shop Now
            </Link>
            <a 
              href="https://wa.me/919876543210?text=Hi!%20I'm%20interested%20in%20your%20resin%20art%20products.%20%F0%9F%8E%A8" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-lg transition-all backdrop-blur-sm hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              Order on WhatsApp
            </a>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white mb-1">2700+</span>
              <span className="text-violet-200 text-sm font-medium">Happy Customers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white mb-1">337+</span>
              <span className="text-violet-200 text-sm font-medium">Creations</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white mb-1">100%</span>
              <span className="text-violet-200 text-sm font-medium">Handmade</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

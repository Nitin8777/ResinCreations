'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="relative group">
        {/* Tooltip */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
          Chat with us
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45"></div>
        </div>
        
        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25"></div>
        
        {/* Button */}
        <a
          href="https://wa.me/919876543210?text=Hi!%20I'm%20interested%20in%20your%20resin%20art%20products.%20%F0%9F%8E%A8"
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-xl hover:scale-110 transition-transform duration-300"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-8 h-8 fill-current" />
        </a>
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

export default function CategoryCard({ name, slug, image, icon }) {
  // Dynamically render icon if provided as string
  const IconComponent = icon && LucideIcons[icon] ? LucideIcons[icon] : null;

  return (
    <Link href={`/categories/${slug}`} className="group block relative overflow-hidden rounded-xl aspect-[4/3] bg-gray-100">
      {image ? (
        <img 
          src={image} 
          alt={name} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-violet-200 to-violet-400 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
          {IconComponent && <IconComponent className="w-16 h-16 text-violet-600 opacity-20" />}
        </div>
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 flex flex-col items-center justify-end text-center z-10">
        {IconComponent && <IconComponent className="w-6 h-6 text-white mb-2 opacity-90" />}
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">{name}</h3>
      </div>
    </Link>
  );
}

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Heart, Gem } from 'lucide-react';

function InstagramIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#1E1B4B] text-violet-100 pt-16 pb-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-white">
              <Gem className="w-7 h-7 text-[#D4AF37]" />
              <span className="text-xl font-bold tracking-tight">Khushi Resin</span>
            </Link>
            <p className="text-sm text-violet-200 leading-relaxed mt-4">
              Handcrafted resin art and personalized gifts made with love and attention to detail. We bring your unique ideas to life through beautiful resin creations.
            </p>
            <div className="pt-2">
              <a 
                href="https://instagram.com/newkhushiresincreations" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-[#D4AF37] hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Products', path: '/products' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className="text-violet-200 hover:text-[#D4AF37] transition-colors text-sm hover:underline underline-offset-4">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
              Categories
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Resin Keychains', slug: 'resin-keychains' },
                { name: 'Resin Jewelry', slug: 'resin-jewelry' },
                { name: 'Photo Frames', slug: 'photo-frames' },
                { name: 'Nameplates', slug: 'nameplates' },
                { name: 'Custom Items', slug: 'custom-items' },
                { name: 'Festival Special', slug: 'festival-special' },
              ].map((category) => (
                <li key={category.slug}>
                  <Link href={`/categories/${category.slug}`} className="text-violet-200 hover:text-[#D4AF37] transition-colors text-sm hover:underline underline-offset-4">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-violet-200 hover:text-white transition-colors group">
                  <Phone className="w-5 h-5 mt-0.5 text-[#25D366] group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-xs text-violet-300">WhatsApp / Call</p>
                    <p className="text-sm">+91 98765 43210</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:hello@khushiresin.com" className="flex items-start gap-3 text-violet-200 hover:text-white transition-colors group">
                  <Mail className="w-5 h-5 mt-0.5 text-violet-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-xs text-violet-300">Email</p>
                    <p className="text-sm">hello@khushiresin.com</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-violet-200">
                  <MapPin className="w-5 h-5 mt-0.5 text-violet-400" />
                  <div>
                    <p className="text-xs text-violet-300">Location</p>
                    <p className="text-sm">Mumbai, Maharashtra, India<br/>(Shipping Worldwide)</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-violet-300 text-center md:text-left">
            © {new Date().getFullYear()} New Khushi Resin Creations. All rights reserved.
          </p>
          <p className="text-xs text-violet-300 flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-red-400 fill-current" /> & Resin
          </p>
        </div>
      </div>
    </footer>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from 'next/link';
import {
  Sparkles,
  KeyRound,
  Gem,
  Frame,
  Home as HomeIcon,
  Palette,
  Gift,
  ArrowUpRight,
  ShieldCheck,
  Wand2,
  Truck
} from 'lucide-react';
import HeroBanner from '@/components/HeroBanner';
import ProductCard from '@/components/ProductCard';
import InstagramReelsSection from '@/components/InstagramReelsSection';
import ReviewsSection from '@/components/ReviewsSection';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

const categories = [
  {
    name: 'Resin Keychains',
    slug: 'resin-keychains',
    Icon: KeyRound,
    tag: 'Trending',
    subtitle: 'Custom Alphabet & Shimmer',
    description: 'Personalized initial letters, glitter flakes, and pocket-sized keepsakes.',
    image: '/images/key1 (1).jpg',
    itemCount: '15+ Designs',
  },
  {
    name: 'Resin Jewelry',
    slug: 'resin-jewelry',
    Icon: Gem,
    tag: 'Bestseller',
    subtitle: 'Botanical Floral Elegance',
    description: 'Real dried petals and golden flakes set in crystal earrings, rings & pendants.',
    image: '/images/key1 (3).jpg',
    itemCount: '24+ Designs',
  },
  {
    name: 'Photo Frames',
    slug: 'resin-photo-frames',
    Icon: Frame,
    tag: 'Preserved Forever',
    subtitle: 'Timeless Keepsakes',
    description: 'Preserve wedding, anniversary, and cherished moments encased in gloss resin.',
    image: '/images/couple.jpg',
    itemCount: '12+ Designs',
  },
  {
    name: 'Nameplates',
    slug: 'resin-nameplates',
    Icon: HomeIcon,
    tag: 'Customizable',
    subtitle: 'Agate & Gold Geode Decor',
    description: 'Statement entrance and desk nameplates tailored with embossed typography.',
    image: '/images/plate.jpg',
    itemCount: '10+ Designs',
  },
  {
    name: 'Custom Items',
    slug: 'custom-items',
    Icon: Palette,
    tag: 'Bespoke Art',
    subtitle: 'Varmala & Made-to-Order',
    description: 'Wedding varmala preservation, resin clocks, coasters, and custom creations.',
    image: '/images/custom.jpg',
    itemCount: 'Made to Order',
  },
  {
    name: 'Festival Special',
    slug: 'festival-special',
    Icon: Gift,
    tag: 'Limited Edition',
    subtitle: 'Pooja Thalis & Hampers',
    description: 'Festive pooja thalis, custom rakhi designs, and festive celebration hampers.',
    image: '/images/fast2.jpg',
    itemCount: 'Festive Deals',
  },
];

const demoProducts = [
  { _id: '1', name: 'Galaxy Resin Keychain', slug: 'galaxy-resin-keychain', price: 299, discountPrice: 249, category: 'resin-keychains', images: [{url: '/images/placeholder.svg'}], featured: true, bestseller: true, inStock: true },
  { _id: '2', name: 'Rose Gold Resin Earrings', slug: 'rose-gold-resin-earrings', price: 499, category: 'resin-jewelry', images: [{url: '/images/placeholder.svg'}], featured: true, inStock: true },
  { _id: '3', name: 'Floral Resin Photo Frame', slug: 'floral-resin-photo-frame', price: 799, discountPrice: 699, category: 'resin-photo-frames', images: [{url: '/images/placeholder.svg'}], featured: true, inStock: true },
  { _id: '4', name: 'Custom Name Nameplate', slug: 'custom-name-nameplate', price: 999, category: 'resin-nameplates', images: [{url: '/images/placeholder.svg'}], featured: true, bestseller: true, inStock: true },
];

export default async function Home() {
  let liveProducts = [];
  try {
    await dbConnect();
    const fetched = await Product.find({ inStock: { $ne: false } })
      .sort({ featured: -1, bestseller: -1, createdAt: -1 })
      .limit(8)
      .lean();
    if (fetched && fetched.length > 0) {
      liveProducts = JSON.parse(JSON.stringify(fetched));
    }
  } catch (err) {
    console.error('Error fetching home featured products:', err);
  }

  const displayProducts = liveProducts.length > 0 ? liveProducts : demoProducts;

  return (
    <div className="min-h-screen">
      <HeroBanner />
      
      {/* Shop by Category */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto relative">
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-72 bg-gradient-to-r from-violet-200/40 via-pink-100/30 to-amber-100/30 blur-3xl -z-10 rounded-full pointer-events-none" />

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100/80 border border-violet-200/70 text-violet-800 text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-violet-600 animate-pulse" />
            <span>Handcrafted Collections</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 font-serif tracking-tight">
            Shop by Category
          </h2>
          <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed">
            Discover crystal-clear resin art, hand-poured with real dried botanicals, gold foils, and custom details made just for you.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat) => {
            const CatIcon = cat.Icon;
            return (
              <Link
                href={`/categories/${cat.slug}`}
                key={cat.slug}
                className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_35px_-8px_rgba(109,40,217,0.15)] hover:border-violet-200 transition-all duration-500 flex flex-col hover:-translate-y-2"
              >
                {/* Visual Image Banner with Zoom Effect */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                  {/* Top Floating Glass Badge */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/90 text-gray-800 text-xs font-semibold shadow-xs border border-white/60">
                    <CatIcon className="w-3.5 h-3.5 text-violet-600" />
                    <span>{cat.tag}</span>
                  </div>

                  {/* Bottom Item Count Pill */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md text-[11px] font-medium text-white/95">
                    {cat.itemCount}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-violet-600 mb-1">
                      {cat.subtitle}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-violet-700 transition-colors font-serif mb-2">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-4 mt-5 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700 group-hover:text-violet-700 transition-colors">
                      Explore Collection
                    </span>
                    <div className="w-8 h-8 rounded-full bg-violet-50 group-hover:bg-violet-600 text-violet-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs">
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

    

      {/* Featured Products Showcase */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bestselling Creations</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif">Featured Creations</h2>
            <p className="text-gray-600 text-sm mt-1 max-w-xl">
              Most loved pieces handcrafted by our artisans, available for immediate shipping or custom ordering.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors group"
          >
            <span>View All Products</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
          {displayProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-violet-600 text-white rounded-full text-sm font-semibold shadow-md shadow-violet-600/20"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto border-t border-violet-100/60">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>The Khushi Resin Difference</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif">
            Why Discerning Collectors Choose Us
          </h2>
          <p className="mt-2 text-gray-600 text-sm sm:text-base leading-relaxed">
            Every creation is poured with artist-grade epoxy, genuine botanicals, and obsessive care.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
          {[
            {
              Icon: Sparkles,
              title: '100% Handcrafted',
              desc: 'Poured layer by layer with real dried petals, gold foils, and custom details.',
              accent: 'from-amber-50 to-orange-100 text-amber-600',
            },
            {
              Icon: ShieldCheck,
              title: 'Crystal Clear & Non-Yellowing',
              desc: 'High-grade UV-resistant epoxy ensures your memories stay vibrant forever.',
              accent: 'from-violet-50 to-purple-100 text-violet-600',
            },
            {
              Icon: Wand2,
              title: 'Bespoke Personalization',
              desc: 'Names, anniversary dates, photos, and color palettes tailored to your vision.',
              accent: 'from-pink-50 to-rose-100 text-rose-600',
            },
            {
              Icon: Truck,
              title: 'Safe All-India Delivery',
              desc: 'Triple-cushioned shockproof packaging delivered securely to your doorstep.',
              accent: 'from-teal-50 to-emerald-100 text-teal-600',
            },
          ].map((feature, idx) => {
            const FeatIcon = feature.Icon;
            return (
              <div
                key={idx}
                className="text-center p-7 rounded-3xl bg-white border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-lg hover:border-violet-200 transition-all duration-300 group hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${feature.accent} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform duration-300`}
                >
                  <FeatIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 font-serif">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Customer Reviews & Photo/Video Uploads */}
      <ReviewsSection />

      {/* Live Instagram Reels & Feed Section */}
      <InstagramReelsSection />
    </div>
  );
}

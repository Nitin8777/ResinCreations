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
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    itemCount: '15+ Designs',
  },
  {
    name: 'Resin Jewelry',
    slug: 'resin-jewelry',
    Icon: Gem,
    tag: 'Bestseller',
    subtitle: 'Botanical Floral Elegance',
    description: 'Real dried petals and golden flakes set in crystal earrings, rings & pendants.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    itemCount: '24+ Designs',
  },
  {
    name: 'Photo Frames',
    slug: 'resin-photo-frames',
    Icon: Frame,
    tag: 'Preserved Forever',
    subtitle: 'Timeless Keepsakes',
    description: 'Preserve wedding, anniversary, and cherished moments encased in gloss resin.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    itemCount: '12+ Designs',
  },
  {
    name: 'Nameplates',
    slug: 'resin-nameplates',
    Icon: HomeIcon,
    tag: 'Customizable',
    subtitle: 'Agate & Gold Geode Decor',
    description: 'Statement entrance and desk nameplates tailored with embossed typography.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    itemCount: '10+ Designs',
  },
  {
    name: 'Custom Items',
    slug: 'custom-items',
    Icon: Palette,
    tag: 'Bespoke Art',
    subtitle: 'Varmala & Made-to-Order',
    description: 'Wedding varmala preservation, resin clocks, coasters, and custom creations.',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
    itemCount: 'Made to Order',
  },
  {
    name: 'Festival Special',
    slug: 'festival-special',
    Icon: Gift,
    tag: 'Limited Edition',
    subtitle: 'Pooja Thalis & Hampers',
    description: 'Festive pooja thalis, custom rakhi designs, and festive celebration hampers.',
    image: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=800&q=80',
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
    const fetched = await Product.find({ inStock: true })
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

      {/* Featured Products */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto bg-white">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-bold text-violet-900 font-serif">Featured Products</h2>
          <Link href="/products" className="text-violet-600 hover:text-violet-800 font-medium hidden sm:block">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link href="/products" className="inline-block px-6 py-2 bg-violet-100 text-violet-700 rounded-full font-medium">
            View All Products
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-violet-900 mb-10 font-serif">Why Choose Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { Icon: Sparkles, title: '100% Handmade', desc: 'Crafted with love and extreme attention to detail.' },
            { Icon: ShieldCheck, title: 'Premium Quality', desc: 'Using only top-tier epoxy resin and materials.' },
            { Icon: Wand2, title: 'Custom Designs', desc: 'Your vision brought to life perfectly.' },
            { Icon: Truck, title: 'Safe Delivery', desc: 'Securely packaged to reach you safely.' }
          ].map((feature, idx) => {
            const FeatIcon = feature.Icon;
            return (
              <div key={idx} className="text-center p-6 border border-violet-100 rounded-2xl bg-white shadow-xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <FeatIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-violet-900 mb-2 font-serif">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-16 px-4 md:px-8 bg-violet-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-violet-900 mb-4 font-serif">Follow us on Instagram</h2>
          <a href="https://instagram.com/newkhushiresincreations" target="_blank" rel="noreferrer" className="text-violet-600 font-medium hover:underline mb-10 inline-block">@newkhushiresincreations</a>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square bg-violet-200 rounded-xl overflow-hidden relative group">
                {/* Placeholder for IG images */}
                <div className="absolute inset-0 bg-violet-300 animate-pulse"></div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white">❤️</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Customer Reviews & Photo/Video Uploads */}
      <ReviewsSection />

      {/* Live Instagram Reels & Feed Section */}
      <InstagramReelsSection />
    </div>
  );
}

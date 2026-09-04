import Link from 'next/link';
import HeroBanner from '@/components/HeroBanner';
import ProductCard from '@/components/ProductCard';
import InstagramReelsSection from '@/components/InstagramReelsSection';
import ReviewsSection from '@/components/ReviewsSection';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

const categories = [
  { name: 'Resin Keychains', slug: 'resin-keychains', icon: '🔑', description: 'Beautiful custom keychains' },
  { name: 'Resin Jewelry', slug: 'resin-jewelry', icon: '💎', description: 'Elegant earrings, pendants & more' },
  { name: 'Photo Frames', slug: 'resin-photo-frames', icon: '🖼️', description: 'Preserve memories in resin' },
  { name: 'Nameplates', slug: 'resin-nameplates', icon: '🏠', description: 'Custom door & desk nameplates' },
  { name: 'Custom Items', slug: 'custom-items', icon: '🎨', description: 'Made just for you' },
  { name: 'Festival Special', slug: 'festival-special', icon: '🎉', description: 'Seasonal collections' },
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
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-violet-900 mb-10 font-serif">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link href={`/categories/${cat.slug}`} key={cat.slug} className="group flex flex-col items-center p-6 bg-violet-50 rounded-2xl hover:bg-violet-100 transition-colors shadow-sm hover:shadow-md border border-violet-100">
              <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</span>
              <h3 className="text-xl font-semibold text-violet-800 mb-2">{cat.name}</h3>
              <p className="text-gray-600 text-center">{cat.description}</p>
            </Link>
          ))}
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
            { icon: '🎨', title: '100% Handmade', desc: 'Crafted with love and extreme attention to detail.' },
            { icon: '✨', title: 'Premium Quality', desc: 'Using only top-tier epoxy resin and materials.' },
            { icon: '🎁', title: 'Custom Designs', desc: 'Your vision brought to life perfectly.' },
            { icon: '🚚', title: 'Safe Delivery', desc: 'Securely packaged to reach you safely.' }
          ].map((feature, idx) => (
            <div key={idx} className="text-center p-6 border border-violet-100 rounded-2xl bg-white shadow-sm">
              <span className="text-4xl mb-4 block">{feature.icon}</span>
              <h3 className="text-lg font-semibold text-violet-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
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

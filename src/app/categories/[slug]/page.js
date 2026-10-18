import Link from 'next/link';
import {
  Sparkles,
  KeyRound,
  Gem,
  Frame,
  Home as HomeIcon,
  Palette,
  Gift
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

const categoryMap = {
  'resin-keychains': { name: 'Resin Keychains', Icon: KeyRound, description: 'Personalized initial letters, glitter flakes, and pocket-sized keepsakes.' },
  'resin-jewelry': { name: 'Resin Jewelry', Icon: Gem, description: 'Real dried petals and golden flakes set in crystal earrings, rings & pendants.' },
  'resin-photo-frames': { name: 'Photo Frames', Icon: Frame, description: 'Preserve wedding, anniversary, and cherished moments encased in gloss resin.' },
  'resin-nameplates': { name: 'Nameplates', Icon: HomeIcon, description: 'Statement entrance and desk nameplates tailored with embossed typography.' },
  'custom-items': { name: 'Custom Items', Icon: Palette, description: 'Wedding varmala preservation, resin clocks, coasters, and custom creations.' },
  'festival-special': { name: 'Festival Special', Icon: Gift, description: 'Festive pooja thalis, custom rakhi designs, and festive celebration hampers.' },
};

const allDemoProducts = [
  { _id: '1', name: 'Galaxy Resin Keychain', slug: 'galaxy-resin-keychain', price: 299, discountPrice: 249, category: 'resin-keychains', images: [{url: '/images/placeholder.svg'}], featured: true, bestseller: true, inStock: true },
  { _id: '2', name: 'Rose Gold Resin Earrings', slug: 'rose-gold-resin-earrings', price: 499, category: 'resin-jewelry', images: [{url: '/images/placeholder.svg'}], featured: true, inStock: true },
  { _id: '3', name: 'Floral Resin Photo Frame', slug: 'floral-resin-photo-frame', price: 799, discountPrice: 699, category: 'resin-photo-frames', images: [{url: '/images/placeholder.svg'}], featured: true, inStock: true },
  { _id: '4', name: 'Custom Name Nameplate', slug: 'custom-name-nameplate', price: 999, category: 'resin-nameplates', images: [{url: '/images/placeholder.svg'}], featured: true, bestseller: true, inStock: true },
  { _id: '5', name: 'Ocean Wave Keychain', slug: 'ocean-wave-keychain', price: 349, category: 'resin-keychains', images: [{url: '/images/placeholder.svg'}], inStock: true },
  { _id: '6', name: 'Pearl Resin Pendant', slug: 'pearl-resin-pendant', price: 599, discountPrice: 449, category: 'resin-jewelry', images: [{url: '/images/placeholder.svg'}], bestseller: true, inStock: true },
];

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const catData = categoryMap[slug] || { name: 'Category', Icon: Sparkles, description: 'Browse our collection' };
  const CatIcon = catData.Icon;
  
  let categoryProducts = [];
  try {
    await dbConnect();
    const fetched = await Product.find({ category: slug, inStock: true }).sort({ createdAt: -1 }).lean();
    if (fetched && fetched.length > 0) {
      categoryProducts = JSON.parse(JSON.stringify(fetched));
    }
  } catch (err) {
    console.error('Error fetching category products:', err);
  }

  if (categoryProducts.length === 0) {
    categoryProducts = allDemoProducts.filter(p => p.category === slug);
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-violet-600">Home</Link> &gt; 
          <Link href="/products" className="hover:text-violet-600 mx-1">Categories</Link> &gt; 
          <span className="text-gray-900 mx-1">{catData.name}</span>
        </nav>

        {/* Hero */}
        <div className="bg-white rounded-3xl p-8 md:p-10 mb-10 text-center shadow-xs border border-violet-100 flex flex-col items-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center mb-4 shadow-xs">
            <CatIcon className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-serif">{catData.name}</h1>
          <p className="text-gray-600 max-w-xl text-sm sm:text-base leading-relaxed">{catData.description}</p>
        </div>

        {/* Products */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categoryProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500">No products found in this category right now.</p>
            <Link href="/products" className="inline-block mt-4 text-violet-600 hover:underline">Browse all products</Link>
          </div>
        )}
      </div>
    </div>
  );
}

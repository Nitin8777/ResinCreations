import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { ProductDetailClient } from './ProductDetailClient';

// Fallback demo products
const allDemoProducts = [
  { _id: '1', name: 'Galaxy Resin Keychain', slug: 'galaxy-resin-keychain', price: 299, discountPrice: 249, category: 'resin-keychains', images: [{url: '/images/placeholder.svg'}], featured: true, bestseller: true, inStock: true, description: 'Beautiful galaxy themed resin keychain with sparkles.' },
  { _id: '2', name: 'Rose Gold Resin Earrings', slug: 'rose-gold-resin-earrings', price: 499, category: 'resin-jewelry', images: [{url: '/images/placeholder.svg'}], featured: true, inStock: true, description: 'Elegant rose gold earrings embedded in crystal clear resin.' },
  { _id: '3', name: 'Floral Resin Photo Frame', slug: 'floral-resin-photo-frame', price: 799, discountPrice: 699, category: 'resin-photo-frames', images: [{url: '/images/placeholder.svg'}], featured: true, inStock: true, description: 'Custom photo frame with real dried flowers.' },
  { _id: '4', name: 'Custom Name Nameplate', slug: 'custom-name-nameplate', price: 999, category: 'resin-nameplates', images: [{url: '/images/placeholder.svg'}], featured: true, bestseller: true, inStock: true, description: 'Personalized resin nameplate for your home or office.' },
];

export default async function ProductPage({ params }) {
  const { id } = await params;
  
  let product = null;
  let relatedProducts = [];

  try {
    await dbConnect();
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId 
      ? { $or: [{ _id: id }, { slug: id }] }
      : { slug: id };

    const doc = await Product.findOne(query).lean();
    if (doc) {
      product = JSON.parse(JSON.stringify(doc));
      const relatedDocs = await Product.find({ 
        category: product.category, 
        _id: { $ne: product._id },
        inStock: true 
      }).limit(4).lean();
      relatedProducts = JSON.parse(JSON.stringify(relatedDocs));
    }
  } catch (err) {
    console.error('Error fetching product detail:', err);
  }

  if (!product) {
    product = allDemoProducts.find(p => p._id === id || p.slug === id) || allDemoProducts[0];
    relatedProducts = allDemoProducts.filter(p => p.category === product.category && p._id !== product._id).slice(0, 4);
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4">
        <ProductDetailClient product={product} relatedProducts={relatedProducts} />
      </div>
    </div>
  );
}

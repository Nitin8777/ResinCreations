import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import Category from '@/models/Category';

const defaultCategories = [
  { name: 'Resin Keychains', slug: 'resin-keychains', description: 'Handcrafted custom resin keychains', icon: '🔑', displayOrder: 1, image: { url: '/images/placeholder.svg' } },
  { name: 'Resin Jewelry', slug: 'resin-jewelry', description: 'Elegant resin earrings, pendants, bracelets', icon: '💎', displayOrder: 2, image: { url: '/images/placeholder.svg' } },
  { name: 'Photo Frames', slug: 'resin-photo-frames', description: 'Stunning resin photo frames', icon: '🖼️', displayOrder: 3, image: { url: '/images/placeholder.svg' } },
  { name: 'Nameplates', slug: 'resin-nameplates', description: 'Custom resin nameplates for home or office', icon: '🏠', displayOrder: 4, image: { url: '/images/placeholder.svg' } },
  { name: 'Custom Items', slug: 'custom-items', description: 'Unique custom resin art pieces', icon: '🎨', displayOrder: 5, image: { url: '/images/placeholder.svg' } },
  { name: 'Festival Special', slug: 'festival-special', description: 'Special resin creations for festivals', icon: '🎉', displayOrder: 6, image: { url: '/images/placeholder.svg' } },
];

const defaultProducts = [
  {
    name: 'Galaxy Resin Keychain',
    slug: 'galaxy-resin-keychain',
    description: 'Beautiful galaxy-themed resin keychain with silver sparkle foil and deep cosmic purple and blue pigments.',
    shortDescription: 'Cosmic galaxy themed keychain with silver glitter.',
    price: 299,
    discountPrice: 249,
    category: 'resin-keychains',
    images: [{ url: '/images/placeholder.svg' }],
    featured: true,
    bestseller: true,
    inStock: true,
    tags: ['galaxy', 'keychain', 'glitter', 'sparkle']
  },
  {
    name: 'Ocean Wave Keychain',
    slug: 'ocean-wave-keychain',
    description: 'Miniature ocean wave captured in crystal clear resin. Realistic foamy sea wave effect with real sand texture.',
    shortDescription: 'Realistic ocean wave resin keychain with beach sand.',
    price: 349,
    discountPrice: 299,
    category: 'resin-keychains',
    images: [{ url: '/images/placeholder.svg' }],
    featured: true,
    bestseller: true,
    inStock: true,
    tags: ['ocean', 'sea', 'wave', 'beach']
  },
  {
    name: 'Alphabet Resin Keychain (Custom Initial)',
    slug: 'alphabet-resin-keychain',
    description: 'Personalized resin alphabet keychain. Choose any letter from A-Z with your favorite color palette and pressed flowers.',
    shortDescription: 'Personalized A-Z initial keychain with pressed flowers.',
    price: 199,
    category: 'resin-keychains',
    images: [{ url: '/images/placeholder.svg' }],
    featured: false,
    bestseller: true,
    inStock: true,
    tags: ['alphabet', 'letter', 'name', 'initial']
  },
  {
    name: 'Pressed Rose Petal Pendant Necklace',
    slug: 'pressed-rose-petal-pendant',
    description: 'Handpicked, dried and pressed red rose petals encased in crystal-clear teardrop resin pendant with gold-plated chain.',
    shortDescription: 'Handmade real rose petal pendant with gold chain.',
    price: 599,
    discountPrice: 499,
    category: 'resin-jewelry',
    images: [{ url: '/images/placeholder.svg' }],
    featured: true,
    bestseller: true,
    inStock: true,
    tags: ['jewelry', 'necklace', 'rose', 'floral']
  },
  {
    name: 'Gold Leaf Resin Stud Earrings',
    slug: 'gold-leaf-resin-stud-earrings',
    description: 'Pair of hypoallergenic resin stud earrings embedded with 24K imitation gold leaf foil.',
    shortDescription: 'Subtle and elegant gold flake stud earrings.',
    price: 399,
    category: 'resin-jewelry',
    images: [{ url: '/images/placeholder.svg' }],
    featured: false,
    bestseller: false,
    inStock: true,
    tags: ['earrings', 'jewelry', 'gold', 'minimalist']
  },
  {
    name: 'Royal Gold Resin Photo Frame (6x4)',
    slug: 'royal-gold-resin-photo-frame-6x4',
    description: 'Luxurious handcrafted resin photo frame with rich royal purple pigment, gold leaf ribbons, and glass-like crystal finish.',
    shortDescription: 'Stunning 6x4 inch royal purple & gold resin photo frame.',
    price: 1299,
    discountPrice: 999,
    category: 'resin-photo-frames',
    images: [{ url: '/images/placeholder.svg' }],
    featured: true,
    bestseller: true,
    inStock: true,
    tags: ['frame', 'photo', 'gold', 'luxury']
  },
  {
    name: 'Floral Memory Preservation Frame (8x6)',
    slug: 'floral-memory-preservation-frame',
    description: 'Preserve wedding garlands, anniversary bouquets, or special flowers forever in this heavy solid resin block photo frame.',
    shortDescription: 'Flower preservation photo frame for wedding & anniversary flowers.',
    price: 1899,
    category: 'resin-photo-frames',
    images: [{ url: '/images/placeholder.svg' }],
    featured: true,
    bestseller: false,
    inStock: true,
    tags: ['preservation', 'wedding', 'flowers', 'memorial']
  },
  {
    name: 'Custom Resin Nameplate - Home Sweet Home',
    slug: 'custom-resin-nameplate-home',
    description: 'Custom family entrance nameplate made from premium UV-resistant resin with golden embossed acrylic letters.',
    shortDescription: 'Custom entrance nameplate with gold 3D acrylic letters.',
    price: 2499,
    discountPrice: 1999,
    category: 'resin-nameplates',
    images: [{ url: '/images/placeholder.svg' }],
    featured: true,
    bestseller: true,
    inStock: true,
    tags: ['nameplate', 'home', 'door', 'personalized']
  },
  {
    name: 'Desk Nameplate with Pen Holder',
    slug: 'desk-nameplate-pen-holder',
    description: 'Executive desk nameplate with embedded business card and pen stand slot. Customized with your name and designation.',
    shortDescription: 'Personalized office desk nameplate with pen holder.',
    price: 1499,
    category: 'resin-nameplates',
    images: [{ url: '/images/placeholder.svg' }],
    featured: false,
    bestseller: false,
    inStock: true,
    tags: ['office', 'desk', 'corporate', 'gift']
  },
  {
    name: 'Resin Rakhi Collection (Set of 2)',
    slug: 'resin-rakhi-set-of-2',
    description: 'Handcrafted resin rakhis with pressed sacred flowers, gold flakes, and soft silk thread ties.',
    shortDescription: 'Set of 2 handcrafted floral resin rakhis with silk threads.',
    price: 349,
    discountPrice: 299,
    category: 'festival-special',
    images: [{ url: '/images/placeholder.svg' }],
    featured: true,
    bestseller: true,
    inStock: true,
    tags: ['rakhi', 'festival', 'rakshabandhan', 'brother']
  },
  {
    name: 'Diwali Diya Coaster Set (4 pieces)',
    slug: 'diwali-diya-coaster-set',
    description: 'Set of 4 festive resin coasters shaped like lotus blossoms with glittering gold edges and rich jewel tones.',
    shortDescription: 'Set of 4 lotus flower festive resin coasters.',
    price: 799,
    discountPrice: 649,
    category: 'festival-special',
    images: [{ url: '/images/placeholder.svg' }],
    featured: false,
    bestseller: true,
    inStock: true,
    tags: ['diwali', 'coasters', 'festive', 'lotus']
  },
  {
    name: 'Custom Resin Art Clock',
    slug: 'custom-resin-art-clock',
    description: 'Bespoke 12-inch wall clock crafted with multi-layered resin, geode crystals, gold markers, and silent quartz movement.',
    shortDescription: '12-inch luxury resin geode wall clock with silent quartz movement.',
    price: 2799,
    discountPrice: 2299,
    category: 'custom-items',
    images: [{ url: '/images/placeholder.svg' }],
    featured: true,
    bestseller: true,
    inStock: true,
    tags: ['clock', 'geode', 'custom', 'wallart']
  }
];

export async function POST() {
  try {
    await dbConnect();
    
    // Check if products already exist
    const count = await Product.countDocuments();
    if (count === 0) {
      await Category.deleteMany({});
      await Category.insertMany(defaultCategories);
      await Product.insertMany(defaultProducts);
      return NextResponse.json({ success: true, message: `Seeded ${defaultProducts.length} default products!` });
    }

    return NextResponse.json({ success: true, message: `Database already has ${count} products.` });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message || 'Failed to seed products' }, { status: 500 });
  }
}


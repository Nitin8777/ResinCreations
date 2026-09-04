// Seed script to populate MongoDB with demo categories and products
// Run: node src/scripts/seed.js

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manually load .env.local if not already loaded
if (!process.env.MONGODB_URI) {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...vals] = trimmed.split('=');
        if (key && vals.length > 0) {
          process.env[key.trim()] = vals.join('=').trim();
        }
      }
    });
  }
}

// Inline model definitions to avoid ESM/CJS issues
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  image: { url: String, publicId: String },
  icon: String,
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String, maxlength: 200 },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  category: {
    type: String,
    required: true,
    enum: ['resin-keychains', 'resin-jewelry', 'resin-photo-frames', 'resin-nameplates', 'custom-items', 'festival-special']
  },
  images: [{ url: String, publicId: String }],
  customizationOptions: [{
    name: String,
    type: { type: String, enum: ['text', 'color', 'select'] },
    options: [String],
    required: Boolean
  }],
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  bestseller: { type: Boolean, default: false },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const categories = [
  { name: 'Resin Keychains', slug: 'resin-keychains', description: 'Beautiful handcrafted resin keychains with custom designs, names, and colors.', icon: '🔑', displayOrder: 1, image: { url: '/images/placeholder.svg' } },
  { name: 'Resin Jewelry', slug: 'resin-jewelry', description: 'Elegant resin earrings, pendants, bracelets and more.', icon: '💎', displayOrder: 2, image: { url: '/images/placeholder.svg' } },
  { name: 'Photo Frames', slug: 'resin-photo-frames', description: 'Preserve your precious memories in stunning resin photo frames.', icon: '🖼️', displayOrder: 3, image: { url: '/images/placeholder.svg' } },
  { name: 'Nameplates', slug: 'resin-nameplates', description: 'Custom resin nameplates for your home, office, or as a gift.', icon: '🏠', displayOrder: 4, image: { url: '/images/placeholder.svg' } },
  { name: 'Custom Items', slug: 'custom-items', description: 'Get your unique custom resin art pieces made just for you.', icon: '🎨', displayOrder: 5, image: { url: '/images/placeholder.svg' } },
  { name: 'Festival Special', slug: 'festival-special', description: 'Special resin creations for Diwali, Rakhi, Valentine\'s Day and more.', icon: '🎉', displayOrder: 6, image: { url: '/images/placeholder.svg' } },
];

const products = [
  {
    name: 'Galaxy Resin Keychain',
    slug: 'galaxy-resin-keychain',
    description: 'A mesmerizing galaxy-themed resin keychain with swirls of purple, blue, and glitter. Each piece is unique and handcrafted with love. Perfect as a gift or personal accessory.',
    shortDescription: 'Stunning galaxy-themed keychain with purple & blue swirls.',
    price: 299,
    discountPrice: 249,
    category: 'resin-keychains',
    images: [{ url: '/images/placeholder.svg' }],
    customizationOptions: [
      { name: 'Add Your Name', type: 'text', required: false },
      { name: 'Base Color', type: 'select', options: ['Purple', 'Blue', 'Pink', 'Black'], required: false }
    ],
    featured: true, bestseller: true, inStock: true,
    tags: ['galaxy', 'glitter', 'keychain', 'gift']
  },
  {
    name: 'Rose Gold Resin Earrings',
    slug: 'rose-gold-resin-earrings',
    description: 'Delicate rose gold resin earrings with dried flower petals encased in crystal-clear resin. Lightweight and hypoallergenic.',
    shortDescription: 'Elegant rose gold earrings with real dried flowers.',
    price: 499,
    category: 'resin-jewelry',
    images: [{ url: '/images/placeholder.svg' }],
    featured: true, inStock: true,
    tags: ['earrings', 'rose-gold', 'flowers', 'jewelry']
  },
  {
    name: 'Floral Resin Photo Frame',
    slug: 'floral-resin-photo-frame',
    description: 'A gorgeous resin photo frame adorned with preserved flowers and gold leaf accents. Fits a 4x6 inch photo. Perfect gift for anniversaries and birthdays.',
    shortDescription: 'Beautiful floral frame with gold leaf accents.',
    price: 799,
    discountPrice: 699,
    category: 'resin-photo-frames',
    images: [{ url: '/images/placeholder.svg' }],
    featured: true, inStock: true,
    tags: ['photo-frame', 'floral', 'gift', 'anniversary']
  },
  {
    name: 'Custom Name Nameplate',
    slug: 'custom-name-nameplate',
    description: 'Personalized resin nameplate for your home or office. Available in multiple colors and styles. Includes mounting hardware.',
    shortDescription: 'Personalized nameplate with custom name and design.',
    price: 999,
    category: 'resin-nameplates',
    images: [{ url: '/images/placeholder.svg' }],
    customizationOptions: [
      { name: 'Name/Text', type: 'text', required: true },
      { name: 'Color Theme', type: 'select', options: ['Royal Blue', 'Rose Pink', 'Emerald Green', 'Golden'], required: true }
    ],
    featured: true, bestseller: true, inStock: true,
    tags: ['nameplate', 'custom', 'home-decor']
  },
  {
    name: 'Ocean Wave Keychain',
    slug: 'ocean-wave-keychain',
    description: 'Bring the ocean with you! This handcrafted resin keychain features realistic ocean waves with sand and tiny seashells.',
    shortDescription: 'Realistic ocean wave keychain with sand & shells.',
    price: 349,
    category: 'resin-keychains',
    images: [{ url: '/images/placeholder.svg' }],
    customizationOptions: [
      { name: 'Add Your Name', type: 'text', required: false }
    ],
    inStock: true,
    tags: ['ocean', 'beach', 'keychain', 'nature']
  },
  {
    name: 'Pearl Resin Pendant',
    slug: 'pearl-resin-pendant',
    description: 'An exquisite resin pendant featuring real pearl beads suspended in crystal-clear resin. Comes with a gold-plated chain.',
    shortDescription: 'Exquisite pendant with real pearl beads.',
    price: 599,
    discountPrice: 449,
    category: 'resin-jewelry',
    images: [{ url: '/images/placeholder.svg' }],
    bestseller: true, inStock: true,
    tags: ['pendant', 'pearl', 'necklace', 'jewelry']
  },
  {
    name: 'Diwali Special Diya Set',
    slug: 'diwali-special-diya-set',
    description: 'Celebrate Diwali with our handcrafted resin diya set. Set of 4 beautiful diyas with LED tealights included. Available in festive colors.',
    shortDescription: 'Set of 4 handcrafted resin diyas with LED lights.',
    price: 899,
    discountPrice: 749,
    category: 'festival-special',
    images: [{ url: '/images/placeholder.svg' }],
    customizationOptions: [
      { name: 'Color Set', type: 'select', options: ['Traditional Red & Gold', 'Purple & Silver', 'Pink & Rose Gold', 'Blue & White'], required: false }
    ],
    featured: true, inStock: true,
    tags: ['diwali', 'diya', 'festival', 'gift-set']
  },
  {
    name: 'Alphabet Resin Keychain',
    slug: 'alphabet-resin-keychain',
    description: 'Choose your initial! Personalized alphabet resin keychain available in A-Z. Perfect for gifting to friends and family.',
    shortDescription: 'Personalized alphabet initial keychain.',
    price: 199,
    category: 'resin-keychains',
    images: [{ url: '/images/placeholder.svg' }],
    customizationOptions: [
      { name: 'Letter', type: 'text', required: true },
      { name: 'Color', type: 'select', options: ['Red', 'Blue', 'Pink', 'Green', 'Purple', 'Golden'], required: true }
    ],
    inStock: true,
    tags: ['alphabet', 'personalized', 'keychain', 'gift']
  },
  {
    name: 'Custom Couple Photo Frame',
    slug: 'custom-couple-photo-frame',
    description: 'A romantic resin photo frame designed for couples. Features heart-shaped elements and can be customized with names and dates.',
    shortDescription: 'Romantic couple frame with custom names & dates.',
    price: 1299,
    category: 'resin-photo-frames',
    images: [{ url: '/images/placeholder.svg' }],
    customizationOptions: [
      { name: 'Names', type: 'text', required: true },
      { name: 'Date', type: 'text', required: false }
    ],
    bestseller: true, inStock: true,
    tags: ['couple', 'photo-frame', 'romantic', 'anniversary']
  },
  {
    name: 'Rakhi Special Bracelet',
    slug: 'rakhi-special-bracelet',
    description: 'Celebrate the bond of siblings with our special resin Rakhi bracelet. Beautifully crafted with love and care.',
    shortDescription: 'Special resin Rakhi bracelet for siblings.',
    price: 399,
    category: 'festival-special',
    images: [{ url: '/images/placeholder.svg' }],
    inStock: true,
    tags: ['rakhi', 'bracelet', 'festival', 'sibling']
  },
  {
    name: 'Personalized Desk Nameplate',
    slug: 'personalized-desk-nameplate',
    description: 'Elevate your workspace with our premium resin desk nameplate. Features your name and title in elegant gold lettering.',
    shortDescription: 'Premium desk nameplate with gold lettering.',
    price: 1499,
    discountPrice: 1199,
    category: 'resin-nameplates',
    images: [{ url: '/images/placeholder.svg' }],
    customizationOptions: [
      { name: 'Name', type: 'text', required: true },
      { name: 'Title/Designation', type: 'text', required: false },
      { name: 'Style', type: 'select', options: ['Classic', 'Modern', 'Floral', 'Minimalist'], required: false }
    ],
    inStock: true,
    tags: ['desk', 'nameplate', 'office', 'professional']
  },
  {
    name: 'Custom Resin Art Piece',
    slug: 'custom-resin-art-piece',
    description: 'Let us create a unique piece of art just for you! Share your vision and we will bring it to life with resin. Includes consultation call.',
    shortDescription: 'Unique custom art piece made to your specifications.',
    price: 1999,
    category: 'custom-items',
    images: [{ url: '/images/placeholder.svg' }],
    customizationOptions: [
      { name: 'Describe Your Vision', type: 'text', required: true },
      { name: 'Preferred Colors', type: 'text', required: false },
      { name: 'Size', type: 'select', options: ['Small (6 inch)', 'Medium (10 inch)', 'Large (14 inch)'], required: true }
    ],
    featured: true, inStock: true,
    tags: ['custom', 'art', 'personalized', 'unique']
  },
];

async function seed() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.log('⚠️  MONGODB_URI not found in .env.local');
      console.log('   Create .env.local file with your MongoDB Atlas connection string.');
      console.log('   Copy from .env.example and fill in your details.');
      process.exit(1);
    }

    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Seed categories
    console.log('📂 Seeding categories...');
    await Category.insertMany(categories);
    console.log(`   ✅ ${categories.length} categories created`);

    // Seed products
    console.log('📦 Seeding products...');
    await Product.insertMany(products);
    console.log(`   ✅ ${products.length} products created`);

    console.log('\n🎉 Seed complete! Your database is ready.');
    console.log('   Run "npm run dev" to start the development server.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seed();


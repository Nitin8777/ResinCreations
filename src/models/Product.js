const mongoose = require('mongoose');

const imageSubSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, default: '' }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String, maxlength: 200 },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  category: { 
    type: String, 
    required: true, 
    default: 'resin-keychains',
    set: function(val) {
      if (!val) return 'resin-keychains';
      return String(val).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'resin-keychains';
    }
  },
  images: {
    type: [imageSubSchema],
    default: [{ url: '/images/placeholder.svg', publicId: '' }],
    set: function(val) {
      if (Array.isArray(val)) {
        const mapped = val.map(item => {
          if (typeof item === 'string') return { url: item, publicId: '' };
          if (item && typeof item === 'object' && item.url) return { url: item.url, publicId: item.publicId || '' };
          return null;
        }).filter(Boolean);
        return mapped.length > 0 ? mapped : [{ url: '/images/placeholder.svg', publicId: '' }];
      }
      return val;
    }
  },
  customizationOptions: [{
    name: String,
    type: { type: String, enum: ['text', 'color', 'select'], default: 'text' },
    options: [String],
    required: { type: Boolean, default: false }
  }],
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  bestseller: { type: Boolean, default: false },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Category helper: normalize to slug format e.g. "Resin Keychains" -> "resin-keychains"
function normalizeCategory(cat) {
  if (!cat) return 'resin-keychains';
  return String(cat).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'resin-keychains';
}

// Auto-generate slug and normalize fields before validation if not provided
productSchema.pre('validate', function () {
  if (this.category) {
    this.category = normalizeCategory(this.category);
  } else {
    this.category = 'resin-keychains';
  }

  if (this.name && !this.slug) {
    const baseSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    this.slug = `${baseSlug || 'product'}-${Date.now().toString().slice(-6)}`;
  }
});

productSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

productSchema.virtual('isOnSale').get(function () {
  return this.discountPrice != null && this.discountPrice < this.price;
});

// Ensure virtuals are included in JSON and Object representations
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;

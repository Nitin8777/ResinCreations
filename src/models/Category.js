const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  image: { url: String, publicId: String },
  icon: String,
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

// Auto-generate slug from name if not provided
categorySchema.pre('validate', function () {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

module.exports = Category;

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  productName: { type: String, default: 'Custom Resin Art' },
  comment: { type: String, required: true },
  media: [{
    url: { type: String, required: true },
    mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
    publicId: String
  }],
  verified: { type: Boolean, default: true },
  status: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'approved' },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

module.exports = Review;


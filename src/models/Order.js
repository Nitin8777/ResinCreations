const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: String,
    quantity: { type: Number, required: true, min: 1 },
    price: Number,
    customizations: mongoose.Schema.Types.Mixed
  }],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  razorpayOrderId: String,
  razorpayPaymentLinkId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  orderStatus: { type: String, enum: ['received', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'received' },
  shippingAddress: {
    fullAddress: String,
    city: String,
    state: String,
    pincode: String
  },
  notes: String,
  orderSource: { type: String, enum: ['website', 'whatsapp', 'instagram'], default: 'website' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

orderSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

module.exports = Order;

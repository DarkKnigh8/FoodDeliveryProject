const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: String,
  userId: String,
  amount: Number,
  currency: { type: String, default: 'usd' },
  paymentStatus: String,
  stripePaymentId: String
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);

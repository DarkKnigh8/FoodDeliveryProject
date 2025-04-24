const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  paymentMethod: { type: String, enum: ['Cash on Delivery', 'Card'], default: 'Cash on Delivery' },
  status: { type: String, enum: ['Pending', 'Assigned', 'Delivered'], default: 'Pending' },
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  driverLocation: {
    lat: Number,
    lng: Number,
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Delivery', deliverySchema);

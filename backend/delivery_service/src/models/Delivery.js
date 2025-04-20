import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  customerId: { type: String, required: true },
  restaurantId: { type: String, required: true },
  deliveryPersonId: { type: String, default: null },
  status: { type: String, enum: ['pending', 'assigned', 'picked', 'delivered'], default: 'pending' },
  address: { type: String, required: true },
  estimatedTime: { type: String },
}, { timestamps: true });

export default mongoose.model('Delivery', deliverySchema);

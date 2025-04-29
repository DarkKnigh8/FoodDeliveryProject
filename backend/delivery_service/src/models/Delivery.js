import mongoose from 'mongoose';



const deliverySchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: String, required: true },
  deliveryPersonId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Driver', 
    default: null 
  },
  status: { 
    type: String, 
    enum: ['pending', 'assigned', 'picked', 'delivered'], 
    default: 'pending' 
  },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  paymentMethod: { type: String, enum: ['Cash on Delivery', 'Card'], default: 'Cash on Delivery' },
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  driverLocation: {
    lat: Number,
    lng: Number,
  },
  estimatedTime: { type: String },  // Optional, can use Date if needed
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Delivery = mongoose.model('Delivery', deliverySchema);

export default Delivery;
const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  orderId: { type: String, required: true },
<<<<<<< HEAD
  customerId: { type: String, required: true },
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
  estimatedTime: { type: String },  // Can be Date or timestamp if preferred
}, { timestamps: true });
=======
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
>>>>>>> 49486bf853f9d5ca0ad6582ac3250bdcf55a34e9

module.exports = mongoose.model('Delivery', deliverySchema);

const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String, // added
  available: { type: Boolean, default: true }
  
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  image: String, // added
  isAvailable: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },  // Controlled by admin
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  menu: [menuItemSchema]
  
});

module.exports = mongoose.model('Restaurant', restaurantSchema);

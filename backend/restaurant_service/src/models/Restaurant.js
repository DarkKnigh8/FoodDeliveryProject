const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  available: { type: Boolean, default: true }
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  menu: [menuItemSchema]
});

module.exports = mongoose.model('Restaurant', restaurantSchema);

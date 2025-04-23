const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: String,
  available: { type: Boolean, default: true },
  location: {
    lat: Number,
    lng: Number
  }
});

module.exports = mongoose.model('Driver', driverSchema);

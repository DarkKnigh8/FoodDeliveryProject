import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  name: String,
  isAvailable: { type: Boolean, default: true },
  currentLocation: {
    lat: Number,
    lng: Number
  }
});

export default mongoose.model('Driver', driverSchema);
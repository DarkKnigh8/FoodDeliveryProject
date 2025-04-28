import Delivery from '../models/Delivery.js';
import Driver from '../models/Driver.js';

const assignDeliveryPerson = async (deliveryId) => {
  const delivery = await Delivery.findById(deliveryId);
  if (!delivery) return null;

  // Simulate getting delivery location (for now, hardcode or get from delivery.address)
  const orderLat = 6.9271; // example: Colombo
  const orderLng = 79.8612;

  // Get available drivers sorted by closest location
  const availableDrivers = await Driver.find({ isAvailable: true });

  if (!availableDrivers.length) return null;

  const getDistance = (a, b) => {
    return Math.sqrt(Math.pow(a.lat - b.lat, 2) + Math.pow(a.lng - b.lng, 2));
  };

  const closestDriver = availableDrivers.reduce((prev, curr) => {
    return getDistance(curr.currentLocation, { lat: orderLat, lng: orderLng }) <
           getDistance(prev.currentLocation, { lat: orderLat, lng: orderLng }) ? curr : prev;
  });

  // Update delivery assignment
  delivery.deliveryPersonId = closestDriver._id;
  delivery.status = 'assigned';
  await delivery.save();

  // Mark driver as unavailable
  closestDriver.isAvailable = false;
  await closestDriver.save();

  return delivery;
};

export default assignDeliveryPerson;
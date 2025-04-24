<<<<<<< HEAD
import mongoose from 'mongoose';
import Delivery from '../models/Delivery.js';
import Driver from '../models/Driver.js';
import { getIO } from '../socket.js'; // For real-time updates

// Create Delivery and Auto-Assign Driver
export const createDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.create(req.body);

    // AUTO-ASSIGN DRIVER LOGIC
    const availableDrivers = await Driver.find({ isAvailable: true });

    if (!availableDrivers.length) {
      return res.status(200).json({ message: 'Delivery created, but no drivers available', delivery });
    }

    // Simulate distance logic (just pick first for simplicity)
    const assignedDriver = availableDrivers[0];

    // Update delivery with assigned driver
    delivery.deliveryPersonId = assignedDriver._id;
    delivery.status = 'assigned';
    await delivery.save();

    // Mark driver as unavailable
    assignedDriver.isAvailable = false;
    await assignedDriver.save();

    // Emit real-time status update
    const io = getIO();
    io.emit(`delivery-${delivery._id}-status`, { status: delivery.status });

    res.status(201).json({ message: 'Delivery created and driver assigned', delivery });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update Delivery Status and Emit Real-Time Status Update
export const updateStatus = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, {
      status: req.body.status
    }, { new: true });

    // Emit real-time status update
    const io = getIO();
    io.emit(`delivery-${delivery._id}-status`, { status: delivery.status });

    res.json(delivery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// For the new endpoint that fetches only the assigned delivery
export const getAssignedDelivery = async (req, res) => {
  try {
    // Ensure the deliveryPersonId is properly handled as ObjectId (mongoose.Types.ObjectId)
    const driverId = mongoose.Types.ObjectId(req.user.id);

    // Fetch all deliveries for the logged-in driver
    const deliveries = await Delivery.find({ deliveryPersonId: driverId });

    // If no deliveries are found for this driver
    if (!deliveries || deliveries.length === 0) {
      return res.status(404).json({ message: 'No deliveries assigned to this driver.' });
    }

    // Find the delivery where the status is 'assigned'
    const assignedDelivery = deliveries.find(delivery => delivery.status === 'assigned');
    
    if (assignedDelivery) {
      return res.json(assignedDelivery);  // Return the assigned delivery
    } else {
      return res.status(404).json({ message: 'No assigned deliveries found' }); // If no delivery is assigned
    }
  } catch (err) {
    console.error(err.message); // Log for better debugging
    res.status(500).json({ message: 'Internal Server Error: ' + err.message });
  }
};
=======
const axios = require('axios');
const Delivery = require('../models/Delivery');
const Driver = require('../models/Driver');

// Helper: Auto-assign an available driver
const assignAvailableDriver = async () => {
  const driver = await Driver.findOne({ available: true });
  if (!driver) return null;
  driver.available = false;
  await driver.save();
  return driver._id;
};

// Confirm Checkout Controller
exports.confirmCheckout = async (req, res) => {
  try {
    const { orderId, address, phone, paymentMethod } = req.body;

    console.log('📥 Confirm Checkout Request:', { orderId, address, phone, paymentMethod });

    // Validate required fields
    if (!orderId || !address || !phone) {
      console.log('❌ Missing Fields');
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Fetch order details from order service
    const orderServiceURL = `http://localhost:5005/api/orders/${orderId}`;
    let order;

    try {
      const orderResponse = await axios.get(orderServiceURL, {
        headers: { Authorization: req.headers.authorization }
      });
      order = orderResponse.data;
      console.log('✅ Order Fetched:', order);
    } catch (fetchError) {
      console.error('❌ Failed to Fetch Order:', fetchError.message);
      return res.status(500).json({ message: 'Failed to fetch order details' });
    }

    if (!order || !order.customerId) {
      console.log('❌ Order Not Found or Missing Customer ID');
      return res.status(404).json({ message: 'Order not found from order service' });
    }

    // Assign available driver
    try {
      const assignedDriverId = await assignAvailableDriver();
      console.log('🚚 Assigned Driver ID:', assignedDriverId);

      // Create and save new delivery
      const newDelivery = new Delivery({
        orderId,
        customerId: order.customerId,
        address,
        phone,
        paymentMethod,
        status: assignedDriverId ? 'Assigned' : 'Pending',
        assignedDriver: assignedDriverId || null
      });

      const savedDelivery = await newDelivery.save();
      console.log('✅ Delivery Saved:', savedDelivery);

      return res.status(201).json(savedDelivery);
    } catch (driverOrSaveError) {
      console.error('❌ Driver Assignment or Save Failed:', driverOrSaveError.message);
      return res.status(500).json({ message: 'Driver assignment or save failed' });
    }

  } catch (error) {
    console.error('❌ Unhandled Confirm Checkout Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
>>>>>>> 49486bf853f9d5ca0ad6582ac3250bdcf55a34e9

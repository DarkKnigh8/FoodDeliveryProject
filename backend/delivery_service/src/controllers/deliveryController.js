// Merge the conflicting parts manually
import mongoose from 'mongoose';
import axios from 'axios';
import Delivery from '../models/Delivery.js';
import { getIO } from '../socket.js';
import jwt from 'jsonwebtoken';

// Create Delivery and Auto-Assign Driver
export const createDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.create(req.body);

    const availableDrivers = await Driver.find({ isAvailable: true });

    if (!availableDrivers.length) {
      return res.status(200).json({ message: 'Delivery created, but no drivers available', delivery });
    }

    const assignedDriver = availableDrivers[0];
    delivery.deliveryPersonId = assignedDriver._id;
    delivery.status = 'assigned';
    await delivery.save();

    assignedDriver.isAvailable = false;
    await assignedDriver.save();

    const io = getIO();
    io.emit(`delivery-${delivery._id}-status`, { status: delivery.status });

    res.status(201).json({ message: 'Delivery created and driver assigned', delivery });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Confirm Checkout and Create Delivery
export const confirmCheckout = async (req, res) => {
  try {
    const { orderId, address, phone, paymentMethod } = req.body;

    if (!orderId || !address || !phone || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields (orderId, address, phone, paymentMethod)' });
    }

    // 1. Fetch Order Details
    const orderServiceURL = `http://localhost:5005/api/orders/${orderId}`;
    const orderResponse = await axios.get(orderServiceURL, {
      headers: { Authorization: req.headers.authorization }
    });

    const order = orderResponse.data;

    if (!order || !order.customerId || !order.restaurantId) {
      return res.status(404).json({ message: 'Order not found or invalid data' });
    }

    // 2. Assign a driver (hardcoded)
    const hardcodedDriverId = new mongoose.Types.ObjectId("680915643c8f937ea053f597");

    // 3. Create Delivery
    const newDelivery = new Delivery({
      orderId: order._id,
      customerId: order.customerId,
      restaurantId: order.restaurantId,
      address,
      phone,
      paymentMethod,
      status: 'assigned',
      deliveryPersonId: hardcodedDriverId,
    });

    const savedDelivery = await newDelivery.save();

    // 4. Emit socket event (Assigned)
    const io = getIO();
    io.emit(`delivery-${savedDelivery._id}-status`, { status: savedDelivery.status });

    res.status(201).json({
      message: 'Delivery created and driver assigned',
      delivery: savedDelivery
    });

  } catch (error) {
    console.error('[DELIVERY ERROR] confirmCheckout:', error.message);
    res.status(500).json({ message: 'Internal server error: ' + error.message });
  }
};

// ✅ Update Delivery Status (Picked → Delivered)
export const updateStatus = async (req, res) => {
  try {
    const deliveryId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const updatedDelivery = await Delivery.findByIdAndUpdate(
      deliveryId,
      { status },
      { new: true }
    );

    if (!updatedDelivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    // Emit socket for real-time status update
    const io = getIO();
    io.emit(`delivery-${updatedDelivery._id}-status`, { status: updatedDelivery.status });

    res.json(updatedDelivery);

  } catch (error) {
    console.error('[DELIVERY ERROR] updateStatus:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// ✅ Get Currently Assigned Delivery (For Driver)
export const getAssignedDelivery = async (req, res) => {
  try {
    // Get token from the authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authorization token required' });
    }
    
    // Decode the token to get user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const driverId = decoded.id || decoded._id; // Depending on how you structured your token

    console.log(driverId, "Driver Id");

    // Find deliveries assigned to this driver
    const deliveries = await Delivery.find({ deliveryPersonId: driverId });
    
    if (!deliveries.length) {
      return res.status(404).json({ message: 'No deliveries assigned to this driver.' });
    }
    
    // Get delivery which is still active
    const activeDelivery = deliveries.find(d => ['assigned', 'picked'].includes(d.status));
    
    if (activeDelivery) {
      return res.status(200).json(activeDelivery);
    } else {
      return res.status(404).json({ message: 'No active deliveries.' });
    }
  } catch (error) {
    console.error('[DELIVERY ERROR] getAssignedDelivery:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// ✅ Get All Deliveries Assigned to Driver
export const getDeliveriesByPerson = async (req, res) => {
  try {
    const hardcodedDriverId = new mongoose.Types.ObjectId("680915643c8f937ea053f597");

    const deliveries = await Delivery.find({ deliveryPersonId: hardcodedDriverId });
    res.status(200).json(deliveries);
  } catch (error) {
    console.error('[DELIVERY ERROR] getDeliveriesByPerson:', error.message);
    res.status(500).json({ message: 'Error fetching deliveries' });
  }
};

// ✅ Get Delivery by ID (For tracking page / customer side)
export const getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.status(200).json(delivery);
  } catch (error) {
    console.error('[DELIVERY ERROR] getDeliveryById:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

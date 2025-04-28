import mongoose from 'mongoose';
import axios from 'axios';
import Delivery from '../models/Delivery.js';
import Driver from '../models/Driver.js';
import { getIO } from '../socket.js'; // For real-time updates

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

// Update Delivery Status
export const updateStatus = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, {
      status: req.body.status
    }, { new: true });

    const io = getIO();
    io.emit(`delivery-${delivery._id}-status`, { status: delivery.status });

    res.json(delivery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get Assigned Delivery
export const getAssignedDelivery = async (req, res) => {
  try {
    const driverId = mongoose.Types.ObjectId(req.user.id);
    const deliveries = await Delivery.find({ deliveryPersonId: driverId });

    if (!deliveries || deliveries.length === 0) {
      return res.status(404).json({ message: 'No deliveries assigned to this driver.' });
    }

    const assignedDelivery = deliveries.find(delivery => delivery.status === 'assigned');

    if (assignedDelivery) {
      return res.json(assignedDelivery);
    } else {
      return res.status(404).json({ message: 'No assigned deliveries found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error: ' + err.message });
  }
};

// Confirm Checkout
export const confirmCheckout = async (req, res) => {
  try {
    const { orderId, address, phone, paymentMethod } = req.body;

    if (!orderId || !address || !phone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const orderServiceURL = `http://localhost:5005/api/orders/${orderId}`;
    const orderResponse = await axios.get(orderServiceURL, {
      headers: { Authorization: req.headers.authorization }
    });

    const order = orderResponse.data;
    if (!order || !order.customerId) {
      return res.status(404).json({ message: 'Order not found or missing customer ID' });
    }

    const availableDriver = await Driver.findOne({ isAvailable: true });
    if (!availableDriver) {
      return res.status(200).json({ message: 'No drivers available right now' });
    }

    availableDriver.isAvailable = false;
    await availableDriver.save();

    const newDelivery = new Delivery({
      orderId,
      customerId: order.customerId,
      address,
      phone,
      paymentMethod,
      status: 'Assigned',
      deliveryPersonId: availableDriver._id
    });

    const savedDelivery = await newDelivery.save();
    res.status(201).json(savedDelivery);

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get Deliveries by Logged-in Delivery Person
export const getDeliveriesByPerson = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ deliveryPersonId: req.user.id });
    res.status(200).json(deliveries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching deliveries' });
  }
};
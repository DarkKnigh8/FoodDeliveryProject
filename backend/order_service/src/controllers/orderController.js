// controllers/orderController.js — Hardened against injection and misuse

const mongoose = require('mongoose');
const Order = require('../models/Order');

// ✅ Utility: validate Mongo ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ✅ Utility: sanitize text fields
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>"'`]/g, '').trim();
};

// Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const { restaurantId, items, totalPrice } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: 'User authentication failed' });
    }

    // ✅ Validate inputs
    if (
      !restaurantId ||
      !Array.isArray(items) ||
      items.length === 0 ||
      typeof totalPrice !== 'number'
    ) {
      return res.status(400).json({ error: 'Missing or invalid order fields' });
    }

    // ✅ Sanitize restaurantId
    const cleanRestaurantId = sanitizeString(restaurantId);

    const newOrder = new Order({
      customerId: req.user.id,
      restaurantId: cleanRestaurantId,
      items: items.map((it) => ({
        name: sanitizeString(it.name),
        quantity: Number(it.quantity) || 0,
        price: Number(it.price) || 0,
      })),
      totalPrice: Number(totalPrice),
    });

    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Order placement error:', err);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

// Get all orders for the logged-in customer
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Update order status by ID
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    const updated = await Order.findByIdAndUpdate(
      orderId,
      { status: sanitizeString(status) },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Order not found' });

    res.json(updated);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

// Track an order
exports.getOrderTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!isValidObjectId(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ status: order.status, location: order.currentLocation });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tracking data' });
  }
};

// Update order location
exports.updateOrderLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const { orderId } = req.params;

    if (!isValidObjectId(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { currentLocation: { lat: Number(lat), lng: Number(lng) } },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error updating location' });
  }
};

// Secure: Get orders for a specific restaurant (restaurant owner only)
exports.getOrdersByRestaurant = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    if (req.user.role !== 'restaurant') {
      return res.status(403).json({ message: 'Forbidden: Not a restaurant owner' });
    }

    // ✅ Sanitize restaurantId
    const cleanRestaurantId = sanitizeString(restaurantId);

    const orders = await Order.find({
      restaurantId: cleanRestaurantId,
      ownerId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch restaurant orders' });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!isValidObjectId(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findByIdAndDelete(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete order' });
  }
};

// Edit order
exports.editOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { items, totalPrice } = req.body;

    if (!isValidObjectId(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const updated = await Order.findByIdAndUpdate(
      orderId,
      {
        items: (items || []).map((it) => ({
          name: sanitizeString(it.name),
          quantity: Number(it.quantity) || 0,
          price: Number(it.price) || 0,
        })),
        totalPrice: Number(totalPrice) || 0,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Order not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order' });
  }
};

// For delivery service
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!isValidObjectId(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Error fetching order by ID:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// What I fixed

// Validate Mongo IDs using mongoose.Types.ObjectId.isValid.
// → Prevents injection payloads like { "$ne": null }.

// Sanitize all strings before saving to DB.

// Cast numbers (like price, quantity, lat, lng, totalPrice) to avoid type confusion.

// Reject bad input early (return 400 Bad Request for invalid IDs or missing fields).

// Removed stack trace leaks → replaced with generic error messages.
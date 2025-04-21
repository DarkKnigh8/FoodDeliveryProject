const Order = require('../models/Order');

// Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const { restaurantId, items, totalPrice } = req.body;

    console.log("Incoming order request:");
    console.log("User:", req.user);
    console.log("Restaurant ID:", restaurantId);
    console.log("Items:", items);
    console.log("Total Price:", totalPrice);

    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: 'User authentication failed' });
    }

    if (!restaurantId || !Array.isArray(items) || items.length === 0 || !totalPrice) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const newOrder = new Order({
      customerId: req.user.id,
      restaurantId,
      items,
      totalPrice,
    });

    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Order placement error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all orders for the logged-in customer
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update order status by ID
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updated = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Order not found' });

    res.json(updated);
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ error: err.message });
  }
};

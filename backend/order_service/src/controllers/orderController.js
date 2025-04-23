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
exports.getOrderTracking = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ status: order.status, location: order.currentLocation });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tracking data' });
  }
};

exports.updateOrderLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { currentLocation: { lat, lng } },
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
    // Ensure user has the 'restaurant' role
    if (req.user.role !== 'restaurant') {
      return res.status(403).json({ message: 'Forbidden: Not a restaurant owner' });
    }

    // Only fetch orders where restaurantId matches AND userId matches the token
    const orders = await Order.find({ restaurantId, ownerId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch restaurant orders' });
  }
};
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete order' });
  }
};

exports.editOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { items, totalPrice } = req.body;

    const updated = await Order.findByIdAndUpdate(
      orderId,
      { items, totalPrice },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Order not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order' });
  }
};

// // Secure: Update status of an order (restaurant owner only)
// exports.updateOrderStatus = async (req, res) => {
//   const { orderId } = req.params;
//   const { status } = req.body;

//   try {
//     const order = await Order.findById(orderId);

//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     // Only allow update if the user owns the restaurant
//     if (req.user.role !== 'restaurant' || req.user.id !== order.ownerId) {
//       return res.status(403).json({ message: 'Forbidden: You cannot modify this order' });
//     }

//     order.status = status;
//     await order.save();

//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to update order status' });
//   }
// };

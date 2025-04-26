const axios = require('axios');
const Delivery = require('../models/Delivery');

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

    // Create and save new delivery without driver assignment
    const newDelivery = new Delivery({
      orderId,
      customerId: order.customerId,
      address,
      phone,
      paymentMethod,
      status: 'Pending', // No need for 'Assigned' status anymore
      assignedDriver: null, // No driver assignment here
    });

    const savedDelivery = await newDelivery.save();
    console.log('✅ Delivery Saved:', savedDelivery);

    return res.status(201).json(savedDelivery);

  } catch (error) {
    console.error('❌ Unhandled Confirm Checkout Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

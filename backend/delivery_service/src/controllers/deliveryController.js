const axios = require('axios'); // ✅ Add this
const Delivery = require('../models/Delivery');
const Driver = require('../models/Driver');

const assignAvailableDriver = async () => {
  const driver = await Driver.findOne({ available: true });
  if (!driver) return null;
  driver.available = false;
  await driver.save();
  return driver._id;
};

exports.confirmCheckout = async (req, res) => {
  try {
    const { orderId, address, phone, paymentMethod } = req.body;

    console.log('📥 Confirm Checkout Request:', { orderId, address, phone, paymentMethod });

    if (!orderId || !address || !phone) {
      console.log('❌ Missing Fields');
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // ✅ 1. Fetch order details from order_service
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
      return res.status(404).json({ message: 'Order not found from order_service' });
    }

    // ✅ 2. Assign driver
    try {
      const assignedDriverId = await assignAvailableDriver();
      console.log('🚚 Assigned Driver ID:', assignedDriverId);

      // ✅ 3. Save delivery
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

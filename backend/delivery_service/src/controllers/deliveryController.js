import Delivery from '../models/Delivery.js';

export const createDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.create(req.body);
    res.status(201).json(delivery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const assignDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: 'Not found' });

    delivery.deliveryPersonId = 'mock_driver_id'; // simulate logic
    delivery.status = 'assigned';
    await delivery.save();

    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, {
      status: req.body.status
    }, { new: true });

    res.json(delivery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getDeliveriesByPerson = async (req, res) => {
  const deliveries = await Delivery.find({ deliveryPersonId: req.user.id });
  res.json(deliveries);
};

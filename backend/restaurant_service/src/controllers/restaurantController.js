const restaurantService = require('../services/restaurantService');

exports.createRestaurant = async (req, res) => {
  try {
    const restaurant = await restaurantService.createRestaurant(req.body.name);
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantService.getAllRestaurants();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addMenuItem = async (req, res) => {
  try {
    const updated = await restaurantService.addMenuItem(req.params.restaurantId, req.body);
    res.json(updated.menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.setAvailability = async (req, res) => {
  try {
    const restaurant = await restaurantService.setAvailability(req.params.restaurantId, req.body.isAvailable);
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add below existing methods
exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await restaurantService.updateRestaurant(req.params.restaurantId, req.body);
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await restaurantService.deleteRestaurant(req.params.restaurantId);
    res.json({ message: 'Restaurant deleted', restaurant });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

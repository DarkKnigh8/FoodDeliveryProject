const Restaurant = require('../models/Restaurant');
const fs = require('fs');
const path = require('path');


const deleteImageFile = (imageUrl) => {
  if (!imageUrl) return;

  // Extract path after "/public/"
  const relativePath = imageUrl.split('/public/')[1];
  const fullPath = path.join(__dirname, '../../public', relativePath);

  fs.unlink(fullPath, (err) => {
    if (err) console.error('Error deleting image:', err.message);
  });
};



/// Create new restaurant
exports.createRestaurant = async (req, res) => {
  try {
    const { name, location } = req.body;
    const image = req.file
      ? `${req.protocol}://${req.get('host')}/public/uploads/restaurants/${req.file.filename}`
      : null;

    const ownerId = req.user.id;
    const restaurant = new Restaurant({ name, location, image, owner: ownerId });
    const saved = await restaurant.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Only return verified restaurants for normal access
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isVerified: true });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

///restraunts owners can view their restaunts
exports.getMyRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user.id });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get all restunta by admin
exports.getAllRestaurantsAdmin = async (req, res) => {
  try {
    const restaurants = await Restaurant.find(); // Or add filter if needed
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// /Add menu item
exports.addMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) throw new Error('Restaurant not found');
    if (restaurant.owner.toString() !== req.user.id) throw new Error('Unauthorized');

    const image = req.file
      ? `${req.protocol}://${req.get('host')}/public/uploads/menu/${req.file.filename}`
      : null;

    const menuItem = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image,
    };

    restaurant.menu.push(menuItem);
    const updated = await restaurant.save();
    res.json(updated.menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get menu items (public)
exports.getMenuItems = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) throw new Error('Restaurant not found');
    res.json(restaurant.menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

///Update menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) throw new Error('Restaurant not found');
    if (restaurant.owner.toString() !== req.user.id) throw new Error('Unauthorized');

    const item = restaurant.menu.id(req.params.itemId);
    if (!item) throw new Error('Menu item not found');

    if (req.file) {
      item.image = `${req.protocol}://${req.get('host')}/public/uploads/menu/${req.file.filename}`;
    }

    Object.assign(item, req.body);
    const updated = await restaurant.save();
    res.json(updated.menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/// Delete menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) throw new Error('Restaurant not found');
    if (restaurant.owner.toString() !== req.user.id) throw new Error('Unauthorized');

    const item = restaurant.menu.id(req.params.itemId);
    if (!item) throw new Error('Menu item not found');

    // Delete menu image
    deleteImageFile(item.image);

    restaurant.menu.pull({ _id: req.params.itemId });
    const updated = await restaurant.save();
    res.json(updated.menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/// Update restaurant
exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) throw new Error('Restaurant not found');
    if (restaurant.owner.toString() !== req.user.id) throw new Error('Unauthorized');

    if (req.file) {
      restaurant.image = `${req.protocol}://${req.get('host')}/public/uploads/restaurants/${req.file.filename}`;
    }

    Object.assign(restaurant, req.body);
    const updated = await restaurant.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// /Delete restaurant
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) throw new Error('Restaurant not found');
    if (restaurant.owner.toString() !== req.user.id) throw new Error('Unauthorized');

    // Delete restaurant image
    deleteImageFile(restaurant.image);

    // Delete all menu item images
    restaurant.menu.forEach(item => deleteImageFile(item.image));

    await Restaurant.findByIdAndDelete(restaurant._id);
    res.json({ message: 'Restaurant deleted', restaurant });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Set availability
exports.setAvailability = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) throw new Error('Restaurant not found');
    if (restaurant.owner.toString() !== req.user.id) throw new Error('Unauthorized');

    restaurant.isAvailable = req.body.isAvailable;
    const updated = await restaurant.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//verify restunats
exports.verifyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    restaurant.isVerified = true;
    await restaurant.save();

    res.json({ message: 'Restaurant verified successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


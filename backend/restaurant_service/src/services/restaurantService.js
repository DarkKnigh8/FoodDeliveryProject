const Restaurant = require('../models/Restaurant');

exports.createRestaurant = async (name) => {
  const restaurant = new Restaurant({ name });
  return await restaurant.save();
};

exports.getAllRestaurants = async () => {
  return await Restaurant.find();
};

exports.addMenuItem = async (restaurantId, item) => {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) throw new Error('Restaurant not found');
  
  restaurant.menu.push(item);
  return await restaurant.save();
};

exports.setAvailability = async (restaurantId, isAvailable) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    restaurantId,
    { isAvailable },
    { new: true }
  );
  if (!restaurant) throw new Error('Restaurant not found');

  return restaurant;
};

// Add below existing methods
exports.updateRestaurant = async (restaurantId, updates) => {
    const restaurant = await Restaurant.findByIdAndUpdate(restaurantId, updates, { new: true });
    if (!restaurant) throw new Error('Restaurant not found');
    return restaurant;
  };
  
  exports.deleteRestaurant = async (restaurantId) => {
    const restaurant = await Restaurant.findByIdAndDelete(restaurantId);
    if (!restaurant) throw new Error('Restaurant not found');
    return restaurant;
  };
  
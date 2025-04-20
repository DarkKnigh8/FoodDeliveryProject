const express = require('express');
const router = express.Router();
const controller = require('../controllers/restaurantController');
const { authenticate, requireRole } = require('../middlewares/authMiddleware');
const { restaurantImageUpload, menuImageUpload } = require('../middlewares/imageUpload');

// Read
router.get('/', authenticate, controller.getAllRestaurants);
router.get('/:restaurantId/menu', controller.getMenuItems);

// Create
router.post('/', authenticate, requireRole('restaurant'), restaurantImageUpload.single('image'), controller.createRestaurant);
router.post('/:restaurantId/menu', authenticate, requireRole('restaurant'), menuImageUpload.single('image'), controller.addMenuItem);

// Update
router.put('/:restaurantId/menu/:itemId', authenticate, requireRole('restaurant'), menuImageUpload.single('image'), controller.updateMenuItem);
router.put('/:restaurantId', authenticate, requireRole('restaurant'), restaurantImageUpload.single('image'), controller.updateRestaurant);

// Delete
router.delete('/:restaurantId/menu/:itemId', authenticate, requireRole('restaurant'), controller.deleteMenuItem);
router.delete('/:restaurantId', authenticate, requireRole('restaurant'), controller.deleteRestaurant);

// Availability
router.put('/:restaurantId/availability', authenticate, requireRole('restaurant'), controller.setAvailability);

module.exports = router;

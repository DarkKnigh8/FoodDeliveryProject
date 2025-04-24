const express = require('express');
const router = express.Router();
const controller = require('../controllers/restaurantController');
const { authenticate, requireRole } = require('../middlewares/authMiddleware');
const { restaurantImageUpload, menuImageUpload } = require('../middlewares/imageUpload');
const { searchRestaurants } = require('../controllers/restaurantController'); // Import searchRestaurants

// Read
router.get('/', authenticate, controller.getAllRestaurants);
router.get('/:restaurantId/menu', controller.getMenuItems);
router.put('/verify/:id', authenticate, requireRole('admin'), controller.verifyRestaurant);
router.get('/admin/all', authenticate, requireRole('admin'), controller.getAllRestaurantsAdmin);


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


router.get('/my', authenticate, requireRole('restaurant'), controller.getMyRestaurants);
router.get('/all', authenticate, requireRole('admin'), controller.getAllRestaurantsAdmin);
/*router.put('/verify/:id', authenticate, requireRole('admin'), controller.verifyRestaurant);*/

// Fetch orders for a restaurant
router.get('/:restaurantId/orders', authenticate, requireRole('restaurant'), controller.fetchOrdersForRestaurant);

// Update order status
router.put('/orders/:orderId/status', authenticate, requireRole('restaurant'), controller.updateOrderStatusForOrderService);

// Search route
router.get('/search', authenticate, controller.searchRestaurants);


module.exports = router;

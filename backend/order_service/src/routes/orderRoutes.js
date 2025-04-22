// src/routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, updateOrderStatus,getOrderTracking, updateOrderLocation,getOrdersByRestaurant,deleteOrder,editOrder  } = require('../controllers/orderController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.post('/', placeOrder);
router.get('/my-orders', getMyOrders);
router.put('/:orderId/status', updateOrderStatus);
router.get('/:orderId/track', getOrderTracking);
router.put('/:orderId/location', updateOrderLocation);
router.get('/restaurant/:restaurantId', getOrdersByRestaurant);
router.delete('/:orderId', deleteOrder);
router.put('/:orderId/edit', editOrder);


module.exports = router;

// src/routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, updateOrderStatus } = require('../controllers/orderController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.post('/', placeOrder);
router.get('/my-orders', getMyOrders);
router.put('/:orderId/status', updateOrderStatus);

module.exports = router;

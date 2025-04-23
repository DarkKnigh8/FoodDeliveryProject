const express = require('express');
const router = express.Router();
const { confirmCheckout } = require('../controllers/deliveryController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.post('/checkout', confirmCheckout);

module.exports = router;

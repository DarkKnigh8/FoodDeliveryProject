const express = require('express');
const router = express.Router();
const { confirmCheckout } = require('../controllers/deliveryController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

// Use authentication middleware for all routes in this router
router.use(authenticate);

// Example route where role-based access is enforced
// Only customers are allowed to confirm checkout
router.post('/checkout', requireRole('customer'), confirmCheckout);

module.exports = router;
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const stripe = require('../config/stripe');

// Test checkout route
router.post('/test-checkout', paymentController.testCheckout);

router.post('/create-intent', paymentController.createPaymentIntent);
router.post('/confirm', paymentController.confirmPayment);


// New admin routes
router.get('/admin/transactions', paymentController.getAllTransactions);
router.get('/admin/transactions/filter', paymentController.getFilteredTransactions);



module.exports = router;

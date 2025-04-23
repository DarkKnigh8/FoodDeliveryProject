const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const stripe = require('../config/stripe');

router.post('/test-checkout', async (req, res) => {
  const { amount = 1500, orderId = "test-order", userId = "test-user" } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Test Order ${orderId}`,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'http://localhost:5173/payment-success',
      cancel_url: 'http://localhost:5173/payment-cancelled',
      metadata: {
        orderId,
        userId
      }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/create-intent', paymentController.createPaymentIntent);
router.post('/confirm', paymentController.confirmPayment);

module.exports = router;

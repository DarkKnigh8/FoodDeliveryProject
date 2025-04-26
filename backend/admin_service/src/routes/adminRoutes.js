const express = require('express');
const {
  getAllUsers,
  verifyRestaurant,
  deleteUser,
  getAllRestaurants
} = require('../controllers/adminController');
const {
  authenticate,
  requireRole
} = require('../middlewares/adminMiddleware');
const {
  getAllTransactions,
  getFilteredTransactions
} = require('../controllers/adminPaymentController');


const router = express.Router();

router.get('/users', authenticate, requireRole('admin'), getAllUsers);
router.put('/verify/:userId', authenticate, requireRole('admin'), verifyRestaurant);
router.delete('/user/:userId', authenticate, requireRole('admin'), deleteUser);
router.put('/verify-restaurant/:id', authenticate, requireRole('admin'), verifyRestaurant);

router.get('/restaurants', authenticate, requireRole('admin'), getAllRestaurants);

// Payment management routes
router.get('/payments/transactions', authenticate, requireRole('admin'), getAllTransactions);
router.get('/payments/transactions/filter', authenticate, requireRole('admin'), getFilteredTransactions);


module.exports = router;

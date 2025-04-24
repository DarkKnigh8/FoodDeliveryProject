<<<<<<< HEAD
import express from 'express';
import {
  createDelivery,
  updateStatus,
  getDeliveriesByPerson,
  getAssignedDelivery // Add the new controller method
} from '../controllers/deliveryController.js';

const router = express.Router();
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

// New route to get the assigned delivery for the logged-in driver
router.get('/assigned', authenticate, requireRole('delivery'), getAssignedDelivery); // New route

router.post('/', authenticate, requireRole('restaurant'), createDelivery);
router.put('/:id/status', authenticate, requireRole('delivery'), updateStatus);
router.get('/my', authenticate, requireRole('delivery'), getDeliveriesByPerson);
router.get('/assigned', authenticate, requireRole('delivery'), getAssignedDelivery); // New route
=======
const express = require('express');
const router = express.Router();
const { confirmCheckout } = require('../controllers/deliveryController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

// Use authentication middleware for all routes in this router
router.use(authenticate);
>>>>>>> 49486bf853f9d5ca0ad6582ac3250bdcf55a34e9

// Example route where role-based access is enforced
// Only customers are allowed to confirm checkout
router.post('/checkout', requireRole('customer'), confirmCheckout);

module.exports = router;
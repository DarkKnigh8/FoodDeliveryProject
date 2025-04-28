import express from 'express';
import {
  createDelivery,
  updateStatus,
  getDeliveriesByPerson,
  getAssignedDelivery,
  confirmCheckout // merged in from the CommonJS part
} from '../controllers/deliveryController.js';

import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route: Get the assigned delivery for the logged-in driver
router.get('/assigned', authenticate, requireRole('delivery'), getAssignedDelivery);

// Route: Create a delivery (only restaurants)
router.post('/', authenticate, requireRole('restaurant'), createDelivery);

// Route: Update delivery status (only delivery personnel)
router.put('/:id/status', authenticate, requireRole('delivery'), updateStatus);

// Route: Get deliveries for the logged-in delivery person
router.get('/my', authenticate, requireRole('delivery'), getDeliveriesByPerson);

// Route: Confirm checkout (only customers)
router.post('/checkout', authenticate, requireRole('customer'), confirmCheckout);

export default router;
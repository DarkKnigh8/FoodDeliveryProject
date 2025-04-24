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

export default router;

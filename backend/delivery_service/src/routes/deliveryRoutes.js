import express from 'express';
import {
  confirmCheckout,
  updateStatus,
  getAssignedDelivery,
  getDeliveriesByPerson,
  getDeliveryById, // ✅ Import this controller
} from '../controllers/deliveryController.js';

import { authenticate, requireRole, allowRoles } from '../middleware/authMiddleware.js'; // ✅ allowRoles needed

const router = express.Router();

// ✅ 1. Customer initiates checkout → Create delivery
router.post('/checkout', authenticate, requireRole('customer'), confirmCheckout);

// ✅ 2. Driver updates delivery status (picked/delivered)
router.put('/:id/status', authenticate, requireRole('delivery'), updateStatus);

// ✅ 3. Driver fetches their currently assigned active delivery
router.get('/assigned', authenticate, requireRole('delivery'), getAssignedDelivery);

// ✅ 4. Driver fetches all deliveries assigned to them
router.get('/my', authenticate, requireRole('delivery'), getDeliveriesByPerson);

// ✅ 5. Anyone (admin, customer, delivery) fetches a delivery by ID
router.get('/:id', authenticate, allowRoles(['admin', 'customer', 'delivery']), getDeliveryById);

// Export the router at the end of the file
export default router;

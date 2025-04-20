import express from 'express';
import {
  createDelivery,
  assignDelivery,
  updateStatus,
  getDeliveriesByPerson
} from '../controllers/deliveryController.js';
//import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createDelivery);
router.post('/:id/assign', assignDelivery);
router.put('/:id/status', updateStatus);
router.get('/my', getDeliveriesByPerson);

export default router;

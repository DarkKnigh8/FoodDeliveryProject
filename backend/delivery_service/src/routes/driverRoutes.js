import express from 'express';
import { createDriver, getAllDrivers } from '../controllers/driverController.js';

const router = express.Router();

// Add new driver
router.post('/', createDriver);

// Get all drivers (for testing or admin)
router.get('/', getAllDrivers);

export default router;
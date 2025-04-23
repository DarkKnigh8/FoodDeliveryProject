const express = require('express');
const { registerDriver, updateDriverLocation } = require('../controllers/driverController');

const router = express.Router();

router.post('/register', registerDriver);
router.put('/:driverId/location', updateDriverLocation);

module.exports = router;

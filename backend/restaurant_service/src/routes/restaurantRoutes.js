const express = require('express');
const router = express.Router();
const controller = require('../controllers/restaurantController');

router.post('/', controller.createRestaurant);
router.get('/', controller.getAllRestaurants);
router.post('/:restaurantId/menu', controller.addMenuItem);
router.put('/:restaurantId/availability', controller.setAvailability);
router.put('/:restaurantId', controller.updateRestaurant);
router.delete('/:restaurantId', controller.deleteRestaurant);

module.exports = router;

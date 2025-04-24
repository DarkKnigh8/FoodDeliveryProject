const express = require('express');
const express = require('express');
const router = express.Router();

router.post('/', createDelivery);
router.post('/:id/assign', assignDelivery);
router.put('/:id/status', updateStatus);
router.get('/my', getDeliveriesByPerson);

export default router;

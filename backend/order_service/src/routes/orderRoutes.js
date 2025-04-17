const express = require("express");
const { createOrder, getOrders } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createOrder); // Requires authentication
router.get("/", getOrders); // Public

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  webhookHandler,
  getMyOrders,
} = require("../controllers/paymentController");
const { checkAuth } = require("../middleware/authMiddleware"); 

// Webhook — NO auth middleware (Razorpay directly call karta hai)
router.post("/payment/webhook", webhookHandler);

// Protected routes
router.post("/payment/create-order", checkAuth, createOrder);
router.post("/payment/verify", checkAuth, verifyPayment);
router.get("/payment/my-orders", checkAuth, getMyOrders);

module.exports = router;
const express = require("express");
const router = express.Router();
const { aiChatbot, productDescriptionEnhancer, titleEnhancer, fairPriceChecker } = require("../controllers/aiController");
const {checkAuth} = require("../middleware/authMiddleware");

router.post("/titleEnhancer", checkAuth, titleEnhancer);
router.post("/aiChatbot", aiChatbot);
router.post("/productDescriptionEnhancer", checkAuth, productDescriptionEnhancer);
router.post("/fair-price", fairPriceChecker);

module.exports = router;
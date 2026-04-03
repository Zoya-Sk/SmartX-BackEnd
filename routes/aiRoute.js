const express = require("express");
const router = express.Router();
const { aiChatbot, productDescriptionEnhancer, titleEnhancer  } = require("../controllers/aiController");
const {checkAuth} = require("../middleware/authMiddleware");
router.post("/titleEnhancer", checkAuth, titleEnhancer);

router.post("/aiChatbot", aiChatbot);
router.post("/productDescriptionEnhancer", checkAuth, productDescriptionEnhancer);

module.exports = router;
const express = require("express");
const router = express.Router();
const {checkAuth} = require("../middleware/authMiddleware");

const { sendMessage, findConversation, chatUsers } = require("../controllers/chatController");

router.post("/send-message",checkAuth, sendMessage);
router.get("/find-conversation/:receiverId",checkAuth, findConversation);
router.get("/chat-users",checkAuth, chatUsers);

module.exports = router;
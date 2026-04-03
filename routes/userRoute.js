const express = require("express");
const router = express.Router();
const { createOtp, signUp, login, sendOtpForgotPassword, forgotPasswordVerifyOtp, resetPassword, updateProfilePicture, nameUpdate, passwordUpdate } = require("../controllers/authController");
const { checkAuth } =require("../middleware/authMiddleware");

router.post("/create-otp",createOtp);
router.post("/signup",signUp);
router.post("/login",login);
router.post("/sendOtpForgotPassword",sendOtpForgotPassword);
router.post("/forgotPasswordVerifyOtp",forgotPasswordVerifyOtp);
router.put("/resetPassword",resetPassword);
router.put("/updateProfilePicture",checkAuth, updateProfilePicture);
router.put("/nameUpdate", checkAuth, nameUpdate);
router.put("/passwordUpdate",checkAuth, passwordUpdate);


module.exports = router;
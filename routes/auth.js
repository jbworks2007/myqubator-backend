const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  resetOtp,
  verifyUser,
  validateToken,
  sendOtpEmail,
  forgotPasswordSendOtp,
  changePassword,
} = require("../controllers/auth");

router.post("/signup", signup);

router.post("/signin", signin);

router.post("/verify", verifyUser);

router.post("/resend-otp", resetOtp);

router.post("/verify-token", validateToken);

router.post("/send-otp-email", sendOtpEmail);

router.post("/forgot-password", forgotPasswordSendOtp);

router.post("/change-password", changePassword);

module.exports = router;

import express from "express";
import {
  onboarding,
  verifyEmail,
  sendVerifyOtp,
  login,
  logout,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/onboarding", onboarding);
router.post("/verify-email", verifyEmail);
router.post("/send-verify-otp", sendVerifyOtp);
router.post("/login", login);
router.get("/logout", logout);

export default router;

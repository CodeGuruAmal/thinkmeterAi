import express from "express";
import {
  onboarding,
  sendVerifyOtp,
  verifyEmail,
  login,
  logout,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/onboarding", onboarding);
router.post("/send-verify-otp", sendVerifyOtp);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.get("/logout", logout);

export default router;

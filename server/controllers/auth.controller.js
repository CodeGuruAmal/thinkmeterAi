import User from "../models/user.model.js";
import { hash } from "bcryptjs";
import { generateOtp } from "../utils/generateOtp.js";
import { sendWelcomeAndVerifyEmail } from "../utils/emailService.js";

export const onboarding = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "User already exists" });
    }

    const hashedPassword = await hash(password, 10);
    const otp = generateOtp();
    const hashedOtp = await hash(otp.toString(), 10);
    const otpExpiresAt = Date.now() + 20 * 60 * 1000;

    const user = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verifyOtp: hashedOtp,
      verifyOtpExpires: otpExpiresAt,
    });

    await user.save();

    sendWelcomeAndVerifyEmail(email, name, otp);

    res.status(201).json({
      status: true,
      message: "Account created successfully! Please verify your email.",
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const sendVerifyOtp = (req, res) => {
  res.json({ message: "sendVerifyOtp" });
};

export const verifyEmail = (req, res) => {
  res.json({ message: "verifyEmail" });
};

export const login = (req, res) => {
  res.json({ message: "login" });
};

export const logout = (req, res) => {
  res.json({ message: "logout" });
};

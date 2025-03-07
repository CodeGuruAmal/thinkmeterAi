import User from "../models/user.model.js";
import { compare, hash } from "bcryptjs";
import { generateOtp } from "../utils/generateOtp.js";
import { sendWelcomeAndVerifyEmail } from "../utils/emailService.js";
import jwt from "jsonwebtoken";

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
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (!user.verifyOtp || user.verifyOtpExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    const isMatch = await compare(String(otp), user.verifyOtp);

    if (!isMatch) {
      return res.status(400).json({ status: false, message: "Invalid OTP." });
    }

    // ✅ Update user as verified
    user.isVerified = true;
    user.verifyOtp = null;
    user.verifyOtpExpires = null;

    await user.save();

    res.status(200).json({
      status: true,
      message:
        "Your account has been verified successfully! You can now log in.",
    });
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    res
      .status(500)
      .json({ status: false, message: "Server error. Please try again." });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findById(email);

    if (user.isVerified) {
      return res
        .status(400)
        .json({ status: false, message: "Account already verified" });
    }

    const otp = generateOtp();
    const otpExpiresAt = Date.now() + 10 * 60 * 1000;

    await User.findOneAndUpdate(
      { email },
      {
        verificationOtp: otp,
        verificationOtpExpires: otpExpiresAt,
      }
    );

    sendVerifyEmail(user.email, user.name, otp);

    res.status(200).json({ status: true, message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        status: false,
        message: "Account not verified. Please verify your email.",
      });
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid credentails" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      // maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ status: true, message: "Signed in successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    res.status(200).json({ status: true, message: "Signed out successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

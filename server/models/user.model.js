import express from "express";

const userSchema = new express.Schema(
  {
    name: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verifyOtp: {
      type: Number,
      default: 0,
    },
    verifyOtpExpires: {
      type: Date,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    forgotPasswordOtp: {
      type: Number,
      default: 0,
    },
    forgotPasswordOtpExpires: {
      type: Date,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = express.model("User", userSchema);

export default User;

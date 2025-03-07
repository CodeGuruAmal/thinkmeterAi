import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyOtp: {
      type: String,
      default: 0,
    },
    verifyOtpExpires: {
      type: Date,
      default: 0,
    },
    forgotPasswordOtp: {
      type: String,
      default: 0,
    },
    forgotPasswordOtpExpires: {
      type: Date,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

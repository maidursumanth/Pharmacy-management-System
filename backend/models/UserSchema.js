import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
      name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["user", "admin", "superadmin"],
    default: "user"
  },
  employeeId: {
  type: String,
  required: true,
  unique: true
  },
  profileImage: {
    type: String,
    default: ""
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String,
    default: ""
  },
  otpExpires: {
    type: Date
  },
  resetOtp: {
    type: String,
    default: ""
  },
  resetOtpExpires: {
    type: Date
  },
  jobRole: {
  type: String,
  default: "Staff"
  },
  }, { timestamps: true });

export default mongoose.model("User",userSchema);
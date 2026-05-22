import express from "express";
import rateLimit from "express-rate-limit";

import {
  register,
  login,
  verifyOTP,
  sendRegisterOTP,
  updateProfile,
  changePassword,
  sendForgotPasswordOTP,
  verifyForgotPasswordOTP,
  resetForgotPassword
} from "../controllers/AuthController.js";

import {protect} from "../middleware/authMiddleware.js";

import User from "../models/UserSchema.js";

const router=express.Router();

const otpLimiter=rateLimit({
  windowMs:60*1000,
  max:3,
  message:{
    message:"Too many OTP requests. Try again later."
  }
});

// AUTH
router.post("/send-register-otp",otpLimiter,sendRegisterOTP);
router.post("/verify-otp",verifyOTP);
router.post("/register",register);
router.post("/login",login);

router.post("/forgot-password",otpLimiter,sendForgotPasswordOTP);
router.post("/verify-forgot-otp",verifyForgotPasswordOTP);
router.post( "/reset-password",resetForgotPassword);

// PROFILE
router.put("/update-profile",protect,updateProfile);
router.put("/change-password",protect,changePassword);

// GET CURRENT USER
router.get("/me",protect,async(req,res)=>{
  try{

    const user=await User.findById(req.user.id).select("-password");

    res.json(user);

  }catch(error){

    res.status(500).json({
      error:error.message
    });

  }
});

export default router;
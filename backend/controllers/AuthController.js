import User from "../models/UserSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmails.js";

// SEND REGISTER OTP
export const sendRegisterOTP=async(req,res)=>{
  try{

    const{email,employeeId}=req.body;

    const existingEmail=await User.findOne({email});

    if(existingEmail){
      return res.status(400).json({message:"Email already exists"});
    }

    const existingEmployee=await User.findOne({employeeId});

    if(existingEmployee){
      return res.status(400).json({message:"Employee ID already exists"});
    }

    const otp=Math.floor(100000+Math.random()*900000).toString();

    global.otpStore={
      ...global.otpStore,
      [email]:{
        otp,
        expires:Date.now()+5*60*1000
      }
    };

    await sendEmail(
      email,
      "Verify your account",
      `
      <div style="font-family:sans-serif">
        <h2>PharmaStock OTP</h2>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes</p>
      </div>
      `
    );

    res.status(200).json({message:"OTP sent"});

  }catch(error){

    res.status(500).json({message:error.message});

  }
};

// VERIFY OTP
export const verifyOTP=async(req,res)=>{
  try{

    const{email,otp}=req.body;

    const storedOTP=global.otpStore?.[email];

    if(!storedOTP){
      return res.status(400).json({message:"OTP not found"});
    }

    if(Date.now()>storedOTP.expires){
      return res.status(400).json({message:"OTP expired"});
    }

    if(storedOTP.otp!==otp){
      return res.status(400).json({message:"Invalid OTP"});
    }

    delete global.otpStore[email];

    res.status(200).json({message:"OTP verified"});

  }catch(error){

    res.status(500).json({message:error.message});

  }
};

// REGISTER
export const register=async(req,res)=>{
  try{

    const{name,email,password,employeeId}=req.body;

    const existingUser=await User.findOne({email});

    if(existingUser){
      return res.status(400).json({message:"Email already exists"});
    }

    const existingEmployee=await User.findOne({employeeId});

    if(existingEmployee){
      return res.status(400).json({message:"Employee ID already exists"});
    }

    const hashedPassword=await bcrypt.hash(password,10);

    const user=await User.create({
      name,
      email,
      password:hashedPassword,
      employeeId,
      isVerified:true
    });

    res.status(201).json({
      message:"Account created",
      user
    });

  }catch(error){

    res.status(500).json({message:error.message});

  }
};

// LOGIN
export const login=async(req,res)=>{
  try{

    const{email,password}=req.body;

    const user=await User.findOne({email});

    if(!user){
      return res.status(400).json({Error:"User not found"});
    }

    const isMatch=await bcrypt.compare(password,user.password);

    if(!isMatch){
      return res.status(400).json({Error:"Credential invalid"});
    }

    const token=jwt.sign(
      {
        id:user._id,
        role:user.role,
        employeeId:user.employeeId
      },
      process.env.JWT_SECRET,
      {
        expiresIn:"8hr"
      }
    );

    res.json({
      token,
      user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
        profileImage:user.profileImage||""
      }
    });

  }catch(error){

    res.status(500).json({error:error.message});

  }
};

// UPDATE PROFILE
export const updateProfile=async(req,res)=>{
  try{

    const{name,profileImage}=req.body;

    const updatedUser=await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        profileImage
      },
      {
        returnDocument:"after"
      }
    );

    res.json({
      message:"Profile updated",
      user:updatedUser
    });

  }catch(error){

    res.status(500).json({message:error.message});

  }
};

// CHANGE PASSWORD
export const changePassword=async(req,res)=>{
  try{

    const{currentPassword,newPassword}=req.body;

    if(!currentPassword||!newPassword){
      return res.status(400).json({message:"All fields required"});
    }

    const user=await User.findById(req.user.id);

    if(!user){
      return res.status(404).json({message:"User not found"});
    }

    const isMatch=await bcrypt.compare(currentPassword,user.password);

    if(!isMatch){
      return res.status(400).json({message:"Current password incorrect"});
    }

    const hashedPassword=await bcrypt.hash(newPassword,10);

    user.password=hashedPassword;

    await user.save();

    res.json({message:"Password updated successfully"});

  }catch(error){

    console.log(error);

    res.status(500).json({message:error.message});

  }
};

export const sendForgotPasswordOTP = async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const otp =
      Math.floor(100000 + Math.random() * 900000)
      .toString();

    user.resetOtp = otp;

    user.resetOtpExpires =
      Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendEmail(
      email,
      "Password Reset OTP",
      `
      <div style="font-family:sans-serif">
        <h2>PharmaStock Password Reset</h2>
        <h1>${otp}</h1>
        <p>OTP valid for 5 minutes</p>
      </div>
      `
    );

    res.status(200).json({
      message: "OTP sent successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

export const verifyForgotPasswordOTP =
async (req, res) => {

  try {

    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    if (Date.now() > user.resetOtpExpires) {
      return res.status(400).json({
        message: "OTP expired"
      });
    }

    res.status(200).json({
      message: "OTP verified"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

export const resetForgotPassword =
async (req, res) => {

  try {

    const {
      email,
      otp,
      newPassword
    } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    if (Date.now() > user.resetOtpExpires) {
      return res.status(400).json({
        message: "OTP expired"
      });
    }

    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    user.resetOtp = "";
    user.resetOtpExpires = null;

    await user.save();

    res.status(200).json({
      message: "Password reset successful"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};
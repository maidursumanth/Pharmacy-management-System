import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiEye,
  FiEyeOff,
  FiX
} from "react-icons/fi";

import API from "../services/api";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";

function Login() {

  const navigate = useNavigate();

  // LOGIN STATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // FORGOT PASSWORD STATES
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] =  useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!captchaValue) {
      toast.error("Please complete captcha");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post(
        "/auth/login",
        {
          email,
          password
        }
      );

      localStorage.setItem("token",res.data.token);
      localStorage.setItem("user",JSON.stringify(res.data.user));
      toast.success("Login successful");
      navigate("/dashboard");

    } catch (err) {

      toast.error(err.response?.data?.message ||"Invalid credentials");

    } finally {

      setLoading(false);

    }
  };

  // SEND OTP
  const handleSendOTP = async () => {

    if (!forgotEmail) {
      toast.error("Enter email");
      return;
    }

    try {

      setOtpLoading(true);
      const res = await API.post("/auth/forgot-password",
        {
          email: forgotEmail
        }
      );

      toast.success(res.data.message);
      setOtpSent(true);

    } catch (err) {

      toast.error(err.response?.data?.message ||"Failed to send OTP");

    } finally {

      setOtpLoading(false);

    }
  };

  // OTP CHANGE
  const handleOtpChange = (
    value,
    index
  ) => {

    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];

    updatedOtp[index] = value;

    setOtp(updatedOtp);

    if (value && index < 5) {

      document
        .getElementById(`otp-${index + 1}`)
        ?.focus();

    }
  };

  // VERIFY OTP
  const handleVerifyOTP = async () => {

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      toast.error("Enter valid OTP");
      return;
    }

    try {

      setOtpLoading(true);

      const res = await API.post(
        "/auth/verify-forgot-otp",
        {
          email: forgotEmail,
          otp: finalOtp
        }
      );

      toast.success(res.data.message);

      setShowForgotModal(false);

      navigate("/forgot-password", {
        state: {
          email: forgotEmail,
          otp: finalOtp
        }
      });

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Invalid OTP"
      );

    } finally {

      setOtpLoading(false);

    }
  };

  return (

    <div className="h-screen flex overflow-hidden bg-gray-100">

      {/* LEFT */}
      <div className="hidden lg:block lg:w-1/2 relative">

        <img
          src="/bg_image.png"
          alt="pharmacy"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex flex-col justify-end p-14 text-white">

          <div className="mb-10">

            <div className="w-50 h-50 rounded-2xl bg-white/80 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6">

              <img
                src="/logo.png"
                alt="logo"
                className="w-40 40 object-contain"
              />

            </div>

            <h1 className="text-5xl font-bold leading-tight">
              Pharmacy Inventory
              <br />
              Management System
            </h1>

            <p className="mt-5 text-gray-200 max-w-md text-sm leading-7">
              Monitor stock levels, manage medicines,
              track expiry dates and streamline
              pharmacy operations through one secure
              centralized platform.
            </p>

          </div>

        </div>

      </div>

      {/* RIGHT */}
      <div className="flex-1 flex items-center justify-center bg-white px-6">

        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >

          {/* TOP */}
          <div className="mb-10">

            <h2 className="text-4xl font-bold text-gray-800">
              Sign In
            </h2>

            <p className="text-gray-500 mt-3 text-sm">
              Welcome back. Please login to continue.
            </p>

          </div>

          {/* EMAIL */}
          <div className="mb-5">

            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-2 border border-gray-300 rounded-2xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
              value={email}
              required
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>

          {/* PASSWORD */}
          <div className="mb-5">

            <div className="flex justify-between items-center">

              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <button
                type="button"
                onClick={() =>
                  setShowForgotModal(true)
                }
                className="text-sm text-green-600 hover:underline"
              >
                Forgot Password?
              </button>

            </div>

            <div className="relative mt-2">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-2xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                value={password}
                required
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-4 text-gray-500"
              >
                {showPassword
                  ? <FiEyeOff size={20} />
                  : <FiEye size={20} />
                }
              </button>

            </div>

          </div>

          {/* REMEMBER */}
          <div className="flex items-center gap-2 mb-6">

            <input
              type="checkbox"
              className="accent-green-600"
            />

            <span className="text-sm text-gray-600">
              Remember me
            </span>

          </div>

          {/* CAPTCHA */}
          <div className="mb-6 flex justify-center scale-[0.95] origin-center">

            <ReCAPTCHA
              sitekey={
                import.meta.env
                  .VITE_RECAPTCHA_SITE_KEY
              }
              onChange={(value) =>
                setCaptchaValue(value)
              }
            />

          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-2xl font-semibold text-white transition-all duration-300 ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >

            {loading
              ? "Signing in..."
              : "Sign In"}

          </button>

          {/* FOOTER */}
          <p className="text-center text-sm text-gray-500 mt-8">

            Don’t have an account?{" "}

            <button
              type="button"
              onClick={() =>
                navigate("/register")
              }
              className="text-green-600 font-semibold hover:underline"
            >
              Create Account
            </button>

          </p>

        </motion.form>

      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            className="bg-white w-full max-w-md rounded-3xl p-7 shadow-2xl relative"
          >

            {/* CLOSE */}
            <button
              onClick={() => {

                setShowForgotModal(false);

                setOtpSent(false);

                setOtp([
                  "",
                  "",
                  "",
                  "",
                  "",
                  ""
                ]);

              }}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
            >
              <FiX size={22} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Forgot Password
            </h2>

            <p className="text-sm text-gray-500 mb-6">

              {otpSent
                ? "Enter the OTP sent to your email"
                : "Enter your registered email"}

            </p>

            {!otpSent ? (

              <>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={forgotEmail}
                  onChange={(e) =>
                    setForgotEmail(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 mb-5 outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                />

                <button
                  onClick={handleSendOTP}
                  disabled={otpLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-semibold transition"
                >

                  {otpLoading
                    ? "Sending..."
                    : "Send OTP"}

                </button>
              </>

            ) : (

              <>
                {/* OTP BOXES */}
                <div className="flex justify-between gap-2 mb-5">

                  {otp.map((digit, index) => (

                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handleOtpChange(
                          e.target.value,
                          index
                        )
                      }
                      className="w-12 h-14 border border-gray-300 rounded-xl text-center text-xl font-bold outline-none focus:ring-2 focus:ring-green-500"
                    />

                  ))}

                </div>

                {/* RESEND */}
                <div className="flex justify-end mb-5">

                  <button
                    onClick={handleSendOTP}
                    className="text-sm text-green-600 hover:underline"
                  >
                    Resend OTP
                  </button>

                </div>

                {/* VERIFY */}
                <button
                  onClick={handleVerifyOTP}
                  disabled={otpLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-semibold transition"
                >

                  {otpLoading
                    ? "Verifying..."
                    : "Verify OTP"}

                </button>
              </>

            )}

          </motion.div>

        </div>

      )}

    </div>
  );
}

export default Login;
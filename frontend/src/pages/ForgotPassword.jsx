import { useState } from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import { motion } from "framer-motion";

import {
  FiEye,
  FiEyeOff
} from "react-icons/fi";

import toast from "react-hot-toast";

import API from "../services/api";

function ForgotPassword() {

  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email;

  const otp = location.state?.otp;

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword,
    setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  // PROTECT DIRECT ACCESS
  if (!email || !otp) {

    navigate("/login");

    return null;

  }

  // RESET PASSWORD
  const handleResetPassword = async (e) => {

    e.preventDefault();

    if (!newPassword || !confirmPassword) {

      toast.error("All fields required");

      return;

    }

    if (newPassword.length < 6) {

      toast.error(
        "Password must be at least 6 characters"
      );

      return;

    }

    if (newPassword !== confirmPassword) {

      toast.error("Passwords do not match");

      return;

    }

    try {

      setLoading(true);

      const res = await API.post(
        "/auth/reset-password",
        {
          email,
          otp,
          newPassword
        }
      );

      toast.success(res.data.message);

      navigate("/login");

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Failed to reset password"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">

      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.3
        }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8"
      >

        {/* LOGO */}
        <div className="flex justify-center mb-6">

          <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">

            <img
              src="/logo.png"
              alt="logo"
              className="w-9 h-9 object-contain"
            />

          </div>

        </div>

        {/* TITLE */}
        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Reset Password
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Enter your new password below
          </p>

        </div>

        {/* FORM */}
        <form onSubmit={handleResetPassword}>

          {/* NEW PASSWORD */}
          <div className="mb-5">

            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>

            <div className="relative mt-2">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                className="w-full border border-gray-300 rounded-2xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
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

          {/* CONFIRM PASSWORD */}
          <div className="mb-7">

            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <div className="relative mt-2">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-2xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-4 top-4 text-gray-500"
              >

                {showConfirmPassword
                  ? <FiEyeOff size={20} />
                  : <FiEye size={20} />
                }

              </button>

            </div>

          </div>

          {/* BUTTON */}
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
              ? "Updating Password..."
              : "Reset Password"}

          </button>

          {/* BACK */}
          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
            className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            Back to Login
          </button>

        </form>

      </motion.div>

    </div>
  );
}

export default ForgotPassword;
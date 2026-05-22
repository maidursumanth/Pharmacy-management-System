import { useEffect, useState } from "react";

import Layout from "../components/Layout";

import API from "../services/api";

import {
  FiMail,
  FiHash,
  FiShield,
  FiEdit2,
  FiLock,
  FiCamera,
  FiSave
} from "react-icons/fi";

import toast from "react-hot-toast";

function Profile() {

  const [user, setUser] = useState(null);

  const [name, setName] = useState("");

  const [profileImage,
    setProfileImage] =
    useState("");

  const [currentPassword,
    setCurrentPassword] =
    useState("");

  const [newPassword,
    setNewPassword] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  useEffect(() => {

    fetchProfile();

  }, []);

  // 🔥 FETCH PROFILE
  const fetchProfile = async () => {

    try {

      const res = await API.get(
        "/auth/me"
      );

      setUser(res.data);

      setName(res.data.name);

      setProfileImage(
        res.data.profileImage || ""
      );

    } catch (err) {
      toast.error("Failed to fetch profile")
      console.log(err);

    }
  };

  // 🔥 UPDATE PROFILE
  const updateProfile = async () => {

    try {

      setLoading(true);

      const res = await API.put(
        "/auth/update-profile",
        {
          name,
          profileImage
        }
      );

      toast.success( "Profile updated");

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      fetchProfile();

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Update failed"
      );

    } finally {

      setLoading(false);

    }
  };

  // 🔥 CHANGE PASSWORD
  const changePassword = async () => {

    try {

      if (
        !currentPassword ||
        !newPassword
      ) {

        return toast.error(
          "Fill all password fields"
        );
      }

      setLoading(true);

      await API.put(
        "/auth/change-password",
        {
          currentPassword,
          newPassword
        }
      );

      toast.success(
        "Password updated"
      );

      setCurrentPassword("");
      setNewPassword("");

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Password update failed"
      );

    } finally {

      setLoading(false);

    }
  };

  // 🔥 LOADING
  if (!user) {

    return (
      <Layout>

        <div className="flex justify-center items-center h-[70vh]">

          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-green-600" />

        </div>

      </Layout>
    );
  }

  return (
    <Layout>

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Profile Settings
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your account settings
            and security preferences
          </p>

        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT CARD */}
          <div className="bg-white rounded-3xl shadow-lg p-6 h-fit">

            {/* IMAGE */}
            <div className="flex flex-col items-center">

              <div className="relative">

                {profileImage ? (

                  <img
                    src={profileImage}
                    alt="profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-green-100"
                  />

                ) : (

                  <div className="w-32 h-32 rounded-full bg-green-600 flex items-center justify-center text-white text-5xl font-bold">

                    {user.name
                      ?.charAt(0)
                      .toUpperCase()}

                  </div>

                )}

                {/* CAMERA */}
                <label className="absolute bottom-2 right-2 bg-white shadow-md p-2 rounded-full cursor-pointer hover:bg-gray-100 transition">

                  <FiCamera
                    className="text-gray-700"
                  />

                  <input
                    type="text"
                    placeholder="Image URL"
                    className="hidden"
                  />

                </label>

              </div>

              {/* NAME */}
              <h2 className="mt-5 text-2xl font-bold text-gray-800">

                {user.name}

              </h2>

              {/* ROLE */}
              <span className={`mt-2 px-4 py-1 rounded-full text-sm font-medium ${
                user.role === "admin"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}>

                {user.role}

              </span>

            </div>

            {/* INFO */}
            <div className="mt-8 space-y-4">

              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">

                <FiMail className="text-green-600 text-xl" />

                <div>

                  <p className="text-sm text-gray-500">
                    Email Address
                  </p>

                  <p className="font-medium text-gray-800">
                    {user.email}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">

                <FiHash className="text-green-600 text-xl" />

                <div>

                  <p className="text-sm text-gray-500">
                    Employee ID
                  </p>

                  <p className="font-medium text-gray-800">
                    {user.employeeId}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">

                <FiShield className="text-green-600 text-xl" />

                <div>

                  <p className="text-sm text-gray-500">
                    Role
                  </p>

                  <p className="font-medium text-gray-800 capitalize">
                    {user.role}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-2 space-y-6">

            {/* PROFILE SETTINGS */}
            <div className="bg-white rounded-3xl shadow-lg p-6">

              <div className="flex items-center gap-3 mb-6">

                <FiEdit2 className="text-green-600 text-xl" />

                <h2 className="text-xl font-bold text-gray-800">
                  Edit Profile
                </h2>

              </div>

              <div className="space-y-5">

                {/* NAME */}
                <div>

                  <label className="text-sm font-medium text-gray-600">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    className="w-full mt-2 border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  />

                </div>

                {/* IMAGE URL */}
                <div>

                  <label className="text-sm font-medium text-gray-600">
                    Profile Image URL
                  </label>

                  <input
                    type="text"
                    value={profileImage}
                    onChange={(e) =>
                      setProfileImage(
                        e.target.value
                      )
                    }
                    placeholder="Paste image URL"
                    className="w-full mt-2 border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  />

                </div>

                {/* SAVE BUTTON */}
                <button
                  onClick={updateProfile}
                  disabled={loading}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl transition"
                >

                  <FiSave />

                  Save Changes

                </button>

              </div>

            </div>

            {/* SECURITY */}
            <div className="bg-white rounded-3xl shadow-lg p-6">

              <div className="flex items-center gap-3 mb-6">

                <FiLock className="text-green-600 text-xl" />

                <h2 className="text-xl font-bold text-gray-800">
                  Security Settings
                </h2>

              </div>

              <div className="space-y-5">

                {/* CURRENT PASSWORD */}
                <div>

                  <label className="text-sm font-medium text-gray-600">
                    Current Password
                  </label>

                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) =>
                      setCurrentPassword(
                        e.target.value
                      )
                    }
                    className="w-full mt-2 border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  />

                </div>

                {/* NEW PASSWORD */}
                <div>

                  <label className="text-sm font-medium text-gray-600">
                    New Password
                  </label>

                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(
                        e.target.value
                      )
                    }
                    className="w-full mt-2 border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  />

                </div>

                {/* CHANGE BUTTON */}
                <button
                  onClick={changePassword}
                  disabled={loading}
                  className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl transition"
                >

                  Change Password

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}

export default Profile;
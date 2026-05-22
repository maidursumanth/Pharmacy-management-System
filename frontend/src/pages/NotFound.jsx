import {
  Link
} from "react-router-dom";

import {
  FiAlertTriangle,
  FiArrowLeft
} from "react-icons/fi";

function NotFound() {

  return (

    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="bg-white shadow-lg rounded-3xl p-10 max-w-md w-full text-center border border-gray-100">

        {/* ICON */}
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">

          <FiAlertTriangle
            className="text-red-500"
            size={38}
          />

        </div>

        {/* TITLE */}
        <h1 className="text-5xl font-bold text-gray-800 mb-3">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-gray-700 mb-3">
          Page Not Found
        </h2>

        <p className="text-gray-500 leading-7 mb-8">

          The page you are trying to access does not exist or may have been moved.

        </p>

        {/* BUTTON */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition"
        >

          <FiArrowLeft />

          Go To Dashboard

        </Link>

      </div>

    </div>

  );
}

export default NotFound;
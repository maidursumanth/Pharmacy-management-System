import Layout from "../components/Layout";

import {
  FiMail,
  FiShield,
  FiDatabase,
  FiTrash2
} from "react-icons/fi";

function About() {

  return (

    <Layout>

      <div className="max-w-5xl mx-auto">

        {/* HERO */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">

          <div className="flex items-center gap-4 mb-6">

            <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">

              <FiShield
                className="text-green-600"
                size={28}
              />

            </div>

            <div>

              <h1 className="text-3xl font-bold text-gray-800">
                About PharmaStock
              </h1>

              <p className="text-gray-500 mt-1">
                Pharmacy Management System
              </p>

            </div>

          </div>

          <p className="text-gray-600 leading-7">

            PharmaStock is a modern pharmacy inventory and billing management system designed to simplify medicine tracking, billing operations, stock monitoring, and employee management.

            The system helps pharmacies efficiently manage inventory, generate invoices, monitor stock levels, track medicine activity, and improve operational workflow through a clean and user-friendly interface.

          </p>

        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">

              <FiDatabase
                className="text-blue-600"
                size={22}
              />

            </div>

            <h2 className="text-lg font-semibold text-gray-800">
              Inventory Management
            </h2>

            <p className="text-gray-500 mt-2 leading-7">

              Manage medicines, stock quantity, expiry dates, suppliers, batch numbers, and barcode tracking with real-time updates.

            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">

              <FiShield
                className="text-green-600"
                size={22}
              />

            </div>

            <h2 className="text-lg font-semibold text-gray-800">
              Secure Authentication
            </h2>

            <p className="text-gray-500 mt-2 leading-7">

              Includes OTP verification, protected routes, role-based access control, password reset system, and admin management.

            </p>

          </div>

        </div>

        {/* ACCOUNT DELETION */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">

              <FiTrash2
                className="text-red-600"
                size={22}
              />

            </div>

            <div>

              <h2 className="text-lg font-semibold text-gray-800">
                Account Deletion Request
              </h2>

              <p className="text-sm text-gray-500">
                Request permanent account removal
              </p>

            </div>

          </div>

          <p className="text-gray-600 leading-7">

            If you would like to permanently delete your account and associated data, please contact us through the email address below with your registered account details.

          </p>

          <div className="mt-5 flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-4">

            <FiMail
              className="text-gray-500"
              size={20}
            />

            <span className="text-gray-700 font-medium">

              pharmastock.com@gmail.com

            </span>

          </div>

        </div>

        {/* FOOTER */}
        <div className="text-center text-sm text-gray-400 mt-8 pb-5">

          PharmaStock © 2026

        </div>

      </div>

    </Layout>
  );
}

export default About;
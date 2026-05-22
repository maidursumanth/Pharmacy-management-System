import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiBox,
  FiActivity,
  FiUser,
  FiShield,
  FiCreditCard,
  FiInfo,
  FiClipboard
} from "react-icons/fi";


function Sidebar() {


  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";;

  return (
    <div className="w-64 h-screen bg-white shadow-md p-4">
      <h1 className="text-2xl font-bold text-green-600 mb-8">
        PharmaStock
      </h1>
      <nav className="flex flex-col gap-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded transition ${
              isActive
                ? "bg-green-100 text-green-700 font-semibold"
                : "hover:bg-green-50"
            }`
          }
        >
          <FiHome />
          Dashboard
        </NavLink>

        <NavLink
          to="/medicines"
          className={({ isActive }) =>
    `flex items-center gap-2 p-2 rounded transition ${
      isActive
        ? "bg-green-100 text-green-700 font-semibold"
        : "hover:bg-green-50"
    }`
  }
        >
          <FiBox />
          Medicines
        </NavLink>

        <NavLink
          to="/stock"
         className={({ isActive }) =>
    `flex items-center gap-2 p-2 rounded transition ${
      isActive
        ? "bg-green-100 text-green-700 font-semibold"
        : "hover:bg-green-50"
    }`
  }
        >
          <FiActivity />
          Stock
        </NavLink>

        {/* BILLING */}
        {isAdmin && (
          <NavLink
            to="/billing"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded transition ${
                isActive
                  ? "bg-green-100 text-green-700 font-semibold"
                  : "hover:bg-green-50"
              }`
            }
          >
            <FiCreditCard />
            Billing
          </NavLink>
        )}

        <NavLink
          to="/activities"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded transition ${
              isActive
                ? "bg-green-100 text-green-700 font-semibold"
                : "hover:bg-green-50"
            }`
          }
        >
          <FiClipboard />
          Activities
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
    `flex items-center gap-2 p-2 rounded transition ${
      isActive
        ? "bg-green-100 text-green-700 font-semibold"
        : "hover:bg-green-50"
    }`
  }
        >
          <FiUser />
          Profile
        </NavLink>

        {/* 🔥 ADMIN ONLY */}
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
    `flex items-center gap-2 p-2 rounded transition ${
      isActive
        ? "bg-green-100 text-green-700 font-semibold"
        : "hover:bg-green-50"
    }`
  }
          >
            <FiShield />
            Admin Panel
          </NavLink>
          
        )}
      <NavLink
        to="/about"
        className={({ isActive }) =>
          `flex items-center gap-2 p-2 rounded transition ${
            isActive
              ? "bg-green-100 text-green-700 font-semibold"
              : "hover:bg-green-50"
          }`
        }
      >

        <FiInfo />

        About

      </NavLink>
      </nav>
      
    </div>
  );
}

export default Sidebar;
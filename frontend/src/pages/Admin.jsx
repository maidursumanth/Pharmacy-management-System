import { useEffect, useState } from "react";

import Layout from "../components/Layout";

import API from "../services/api";

import {
  FiSearch,
  FiShield
} from "react-icons/fi";

import toast from "react-hot-toast";

function Admin() {

  const [users, setUsers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const currentUser =
    JSON.parse(
      localStorage.getItem("user")
    );

  const isSuperAdmin =
    currentUser?.role ===
    "superadmin";

  useEffect(() => {
    fetchUsers();
  }, []);

  // FETCH USERS
  const fetchUsers = async () => {

    try {

      const res =
        await API.get(
          "/admin/users"
        );

      // SORT
      const sorted =
        res.data.sort((a, b) => {

          // SUPER ADMIN FIRST
          if (
            a.role ===
              "superadmin" &&
            b.role !==
              "superadmin"
          ) {
            return -1;
          }

          if (
            a.role !==
              "superadmin" &&
            b.role ===
              "superadmin"
          ) {
            return 1;
          }

          // ADMIN SECOND
          if (
            a.role === "admin" &&
            b.role === "user"
          ) {
            return -1;
          }

          if (
            a.role === "user" &&
            b.role === "admin"
          ) {
            return 1;
          }

          // ALPHABETICAL
          return a.name.localeCompare(
            b.name
          );

        });

      setUsers(sorted);

    } catch (err) {

      toast.error(
        "Unable to fetch users"
      );

      console.log(err);

    }
  };

  // CHANGE ROLE
  const changeRole = async (
    id,
    role
  ) => {

    try {

      await API.put(
        `/admin/role/${id}`,
        { role }
      );

      toast.success(
        "Role updated"
      );

      fetchUsers();

    } catch (err) {

      toast.error(
        "Unable to change role"
      );

      console.log(err);

    }
  };

  // UPDATE JOB ROLE
  const updateJobRole =
    async (
      id,
      jobRole
    ) => {

      try {

        await API.put(
          `/admin/job-role/${id}`,
          {
            jobRole
          }
        );

        toast.success(
          "Job role updated"
        );

        fetchUsers();

      } catch (err) {

        toast.error(
          "Failed to update role"
        );

      }
    };

  // SEARCH
  const filteredUsers =
    users.filter((u) =>
      u.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (

    <Layout>

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Admin Control Panel
          </h1>

          <p className="text-gray-500 mt-1">
            Manage employee roles and permissions
          </p>

        </div>

        {/* SEARCH */}
        <div className="flex items-center bg-white px-4 py-3 rounded-xl shadow border border-gray-100 w-full sm:w-80">

          <FiSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Search employee..."
            className="ml-3 w-full outline-none text-sm"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

        <div className="bg-white rounded-2xl shadow p-5">

          <p className="text-gray-500 text-sm">
            Total Employees
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {users.length}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow p-5">

          <p className="text-gray-500 text-sm">
            Admin Accounts
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">

            {
              users.filter(
                (u) =>
                  u.role ===
                    "admin" ||
                  u.role ===
                    "superadmin"
              ).length
            }

          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow p-5">

          <p className="text-gray-500 text-sm">
            Staff Users
          </p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">

            {
              users.filter(
                (u) =>
                  u.role ===
                  "user"
              ).length
            }

          </h2>

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        {/* HEADER */}
        <div className="grid grid-cols-[1.4fr_2.2fr_1fr_1fr_1.5fr_1fr] bg-gray-100 px-6 py-4 text-sm font-semibold text-gray-600 gap-4">

          <div>Employee</div>

          <div>Email</div>

          <div>Employee ID</div>

          <div>Role</div>

          <div>Job Role</div>

          <div className="text-center">
            Actions
          </div>

        </div>

        {/* USERS */}
        <div className="max-h-[550px] overflow-y-auto">

          {filteredUsers.map((u) => {

            // PROTECTED ADMIN
            const isProtectedAdmin =
              u.email ===
              "admin@pharma.com";

            return (

              <div
                key={u._id}
                className="grid grid-cols-[1.4fr_2.2fr_1fr_1fr_1.5fr_1fr] items-center px-6 py-4 border-t hover:bg-gray-50 transition gap-4"
              >

                {/* EMPLOYEE */}
                <div className="flex items-center gap-3">

                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      u.role ===
                      "superadmin"

                        ? "bg-purple-100 text-purple-700"

                        : u.role ===
                          "admin"

                        ? "bg-green-100 text-green-600"

                        : "bg-gray-100 text-gray-600"
                    }`}
                  >

                    <FiShield />

                  </div>

                  <div>

                    <p className="font-medium text-gray-800 truncate">
                      {u.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      Employee
                    </p>

                  </div>

                </div>

                {/* EMAIL */}
                <div className="text-gray-600 truncate pr-3">

                  {u.email}

                </div>

                {/* EMPLOYEE ID */}
                <div className="text-gray-600">

                  {u.employeeId}

                </div>

                {/* ROLE */}
                <div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      u.role ===
                      "superadmin"

                        ? "bg-purple-100 text-purple-700"

                        : u.role ===
                          "admin"

                        ? "bg-green-100 text-green-600"

                        : "bg-gray-100 text-gray-600"
                    }`}
                  >

                    {u.role}

                  </span>

                </div>

                {/* JOB ROLE */}
                <div>

                  <select
                    value={
                      u.jobRole ||
                      "Staff"
                    }
                    disabled={
                      u.role ===
                      "superadmin"
                    }
                    onChange={(e) =>
                      updateJobRole(
                        u._id,
                        e.target.value
                      )
                    }
                    className={`border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none ${
                      u.role ===
                      "superadmin"

                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"

                        : "bg-white"
                    }`}
                  >

                    <option>
                      Pharmacist
                    </option>

                    <option>
                      Cashier
                    </option>

                    <option>
                      Stock Manager
                    </option>

                    <option>
                      Inventory Manager
                    </option>

                    <option>
                      Accountant
                    </option>

                    <option>
                      Sales Staff
                    </option>

                    <option>
                      Staff
                    </option>

                  </select>

                </div>    

                {/* ACTIONS */}
                <div className="flex justify-center">

                  {/* PROTECTED SUPERADMIN */}
                  {u.role === "superadmin" ? (

                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                      Super Admin
                    </span>

                  ) : !isSuperAdmin ? (

                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                      No Access
                    </span>

                  ) : u.role === "user" ? (

                    <button
                      onClick={() =>
                        changeRole(
                          u._id,
                          "admin"
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 text-xs font-semibold transition"
                    >
                      Make Admin
                    </button>

                  ) : u.role === "admin" ? (

                    <button
                      onClick={() =>
                        changeRole(
                          u._id,
                          "user"
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-semibold transition"
                    >
                      Remove
                    </button>

                  ) : null}

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

export default Admin;
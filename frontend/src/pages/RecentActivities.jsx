import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import Skeleton from "../components/Skeleton";

import {
  FiSearch,
  FiClock,
  FiArrowUp,
  FiArrowDown
} from "react-icons/fi";

import { SlRefresh } from "react-icons/sl";

function RecentActivities() {

  const [logs, setLogs] =
    useState([]);

  const [filteredLogs, setFilteredLogs] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {

    const filtered = logs.filter((log) => {

      const query =
        search.toLowerCase();

      return (

        log.medicineName
          ?.toLowerCase()
          .includes(query)

        ||

        log.action
          ?.toLowerCase()
          .includes(query)

        ||

        log.details
          ?.toLowerCase()
          .includes(query)

        ||

        log.performedBy?.name
          ?.toLowerCase()
          .includes(query)

      );

    });

    setFilteredLogs(filtered);

  }, [search, logs]);

  const fetchLogs = async () => {

    try {

      setLoading(true);

      const res =
        await API.get(
          "/medicines/activity"
        );

      setLogs(res.data);

      setFilteredLogs(res.data);

    } catch (err) {

      console.log(err);

    } finally {

      setTimeout(() => {

        setLoading(false);

      }, 50);

    }
  };

  return (

    <Layout>

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Recent Activities
          </h1>

          <p className="text-gray-500 mt-1">
            View all pharmacy activities
          </p>

        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">

          {/* SEARCH */}
          <div className="flex items-center bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm w-full sm:w-96">

            <FiSearch className="text-gray-400" />

            <input
              type="text"
              placeholder="Search by medicine, bill no, role, user..."
              className="ml-3 bg-transparent outline-none w-full text-sm"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          {/* REFRESH */}
          <button
            onClick={fetchLogs}
            className="flex items-center justify-center gap-2 bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-sm hover:bg-gray-50 hover:shadow transition"
          >

            <SlRefresh className="text-gray-600 text-lg" />

            <span className="text-sm font-medium text-gray-700">
              Refresh
            </span>

          </button>

        </div>

      </div>

      {/* ACTIVITY LIST */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">

        {loading ? (

          <div className="divide-y divide-gray-100">

            <Skeleton type="activity" />
            <Skeleton type="activity" />
            <Skeleton type="activity" />
            <Skeleton type="activity" />
            <Skeleton type="activity" />
            <Skeleton type="activity" />

          </div>

        ) : filteredLogs.length > 0 ? (

          <div className="divide-y divide-gray-100">

            {filteredLogs.map((log) => (

              <div
                key={log._id}
                className="px-6 py-5 hover:bg-gray-50 transition"
              >

                <div className="flex items-start justify-between gap-5">

                  {/* LEFT */}
                  <div className="flex gap-4">

                    {/* ICON */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        log.action === "ADD" ||
                        log.action === "CREATE"

                          ? "bg-green-100 text-green-600"

                          : log.action === "UPDATE"

                          ? "bg-blue-100 text-blue-600"

                          : log.action === "SALE"

                          ? "bg-orange-100 text-orange-600"

                          : "bg-red-100 text-red-600"
                      }`}
                    >

                      {log.action === "ADD" ||
                      log.action === "CREATE"

                        ? <FiArrowUp size={20} />

                        : <FiArrowDown size={20} />
                      }

                    </div>

                    {/* INFO */}
                    <div>

                      <div className="flex items-center gap-3 flex-wrap">

                        <h2 className="text-base font-semibold text-gray-800">
                          {log.medicineName}
                        </h2>

                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            log.action === "ADD" ||
                            log.action === "CREATE"

                              ? "bg-green-100 text-green-700"

                              : log.action === "UPDATE"

                              ? "bg-blue-100 text-blue-700"

                              : log.action === "SALE"

                              ? "bg-orange-100 text-orange-700"

                              : "bg-red-100 text-red-700"
                          }`}
                        >

                          {log.action}

                        </span>

                      </div>

                      <p className="text-sm text-gray-600 mt-2 leading-6">
                        {log.details}
                      </p>

                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">

                        <span>

                          By{" "}

                          <span className="font-medium text-gray-600">

                            {log.performedBy?.name ||
                              "Unknown"}

                          </span>

                        </span>

                      </div>

                    </div>

                  </div>

                  {/* TIME */}
                  <div className="flex items-center gap-2 text-sm text-gray-400 whitespace-nowrap">

                    <FiClock size={14} />

                    {new Date(
                      log.createdAt
                    ).toLocaleString("en-GB")}

                  </div>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="h-80 flex items-center justify-center text-gray-500">

            No activities found

          </div>

        )}

      </div>

    </Layout>
  );
}

export default RecentActivities;
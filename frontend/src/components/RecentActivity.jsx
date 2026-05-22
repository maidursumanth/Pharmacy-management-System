import { useEffect, useState } from "react";
import API from "../services/api";
import {
  FiArrowDown,
  FiArrowUp,
  FiClock
} from "react-icons/fi";

function RecentActivity() {

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {

    try {

      const res = await API.get( "/medicines/activity");

      setLogs(res.data.slice(0, 20));

    } catch (err) {

      console.log(err);

    }
  };

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden h-[420px] flex flex-col">

      {/* HEADER */}
      <div className="px-5 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-lg font-semibold text-gray-800">
              Recent Activity
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Latest stock updates
            </p>

          </div>

        </div>

      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto">

        {logs.length > 0 ? (

          <div className="divide-y divide-gray-100">

            {logs.map((log) => (

  <div
    key={log._id}
    className="px-5 py-4 hover:bg-gray-50 transition"
  >

    <div className="flex items-start justify-between gap-4">

      {/* LEFT */}
      <div className="flex gap-3">

        {/* ICON */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            log.action === "ADD" || log.action === "CREATE"
              ? "bg-green-100 text-green-600"
              : log.action === "UPDATE"
              ? "bg-blue-100 text-blue-600"
              : "bg-red-100 text-red-600"
          }`}
        >

          {log.action === "ADD" ||
            log.action === "CREATE" ||
            log.action === "SALE"
            ? <FiArrowUp size={18} />
            : <FiArrowDown size={18} />
          }

        </div>

        {/* INFO */}
        <div>

          <div className="flex items-center gap-2 flex-wrap">

            <h3 className="text-sm font-semibold text-gray-800">
              {log.medicineName}
            </h3>

            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              log.action === "ADD" || log.action === "CREATE"
                ? "bg-green-100 text-green-700"
                : log.action === "UPDATE"
                ? "bg-blue-100 text-blue-600"
                : log.action === "SALE"
                ? "bg-orange-100 text-orange-600"
                : "bg-red-100 text-red-600"
            }`}>

              {log.action}

            </span>

          </div>

          <p className="text-sm text-gray-600 mt-1">
            {log.details}
          </p>

          {/* USER */}
          <p className="text-xs text-gray-400 mt-2">

            Updated by{" "}

            <span className="font-medium text-gray-500">

              {log.performedBy?.name || "Unknown"}

            </span>

          </p>

        </div>

      </div>

      {/* TIME */}
      <div className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">

        <FiClock size={12} />

        {new Date(
          log.createdAt
        ).toLocaleDateString("en-GB")}

      </div>

    </div>

  </div>

))}

          </div>

        ) : (

          <div className="h-full flex flex-col items-center justify-center text-gray-500">

            <p className="text-sm">
              No recent activity
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default RecentActivity;
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import { FiSearch } from "react-icons/fi";
import { SlRefresh } from "react-icons/sl";

import Skeleton from "../components/Skeleton";
import StockModal from "../components/StockModal";
import toast from "react-hot-toast";

function Stock() {

  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [modalType, setModalType] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicines();
  }, []);

const fetchMedicines = async () => {

  try {

    setLoading(true);

    const res = await API.get(
      "/medicines"
    );

    const sorted = res.data.sort(
      (a, b) =>
        a.name.localeCompare(b.name)
    );

    setMedicines(sorted);

  } catch (err) {

    toast.error(
      "Failed to fetch stocks"
    );

    console.log(err);

  } finally {

    setTimeout(() => {

      setLoading(false);

    }, 50);

  }
};

  const updateStock = async (quantity) => {

    try {

      await API.patch(
        `/stock/${selectedMedicine._id}`,
        {
          quantity,
          type: modalType
        }
      );

      fetchMedicines();

      setSelectedMedicine(null);

    } catch (err) {
      toast.error("Failed to update stocks");
      console.log(err);
    }
  };

  const filteredMedicines = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <h1 className="text-2xl font-bold text-green-700">
          Stock Management
        </h1>

        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">

        {/* SEARCH */}
            <div className="flex items-center bg-white px-4 py-2.5 rounded-xl shadow border border-gray-100 w-full sm:w-72">

              <FiSearch className="text-gray-400" />

              <input
                type="text"
                placeholder="Search medicine..."
                className="ml-3 w-full outline-none text-sm"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            {/* REFRESH */}
            <button
              onClick={fetchMedicines}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm hover:bg-gray-50 hover:shadow transition"
            >

              <SlRefresh className="text-gray-600 text-lg" />

              <span className="text-sm font-medium text-gray-700">
                Refresh
              </span>

            </button>

          </div>

      </div>

      {/* USER WARNING */}
      {!isAdmin && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-xl mb-4">
          Only administrators can update stock.
        </div>
      )}

      {/* STOCK LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">

        {loading ? (

            <>
              <Skeleton type="table" />
              <Skeleton type="table" />
              <Skeleton type="table" />
              <Skeleton type="table" />
              <Skeleton type="table" />
              <Skeleton type="table" />
              <Skeleton type="table" />
              <Skeleton type="table" />
            </>

          ) : (

            filteredMedicines.map((m) => (

          <div
            key={m._id}
            className="bg-white rounded-2xl shadow p-5 hover:shadow-lg transition"
          >

            {/* TOP */}
            <div className="flex justify-between items-start">

              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {m.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {m.category}
                </p>
              </div>

              {/* STOCK STATUS */}
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  m.quantity === 0
                    ? "bg-red-100 text-red-600"
                    : m.quantity <= 10
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {m.quantity === 0
                  ? "Out"
                  : m.quantity <= 10
                  ? "Low"
                  : "In Stock"}
              </div>

            </div>

            {/* DETAILS */}
            <div className="mt-5 space-y-2 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Quantity
                </span>

                <span className="font-semibold">
                  {m.quantity}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Price
                </span>

                <span className="font-semibold">
                  ₹{m.price}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Supplier
                </span>

                <span className="font-semibold">
                  {m.supplier || "N/A"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Expiry
                </span>

                <span className="font-semibold">
                  {m.expiryDate
                    ? new Date(m.expiryDate)
                        .toLocaleDateString("en-GB")
                    : "N/A"}
                </span>
              </div>

            </div>

            {/* ADMIN ACTIONS */}
            {isAdmin && (

              <div className="flex gap-2 mt-5">

                <button
                  onClick={() => {
                    setSelectedMedicine(m);
                    setModalType("ADD");
                  }}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Add
                </button>

                <button
                  onClick={() => {
                    setSelectedMedicine(m);
                    setModalType("REMOVE");
                  }}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Remove
                </button>

              </div>

            )}

          </div>

        )))}

      </div>

      {/* 🔥 MODAL */}
      {selectedMedicine && (
        <StockModal
          medicine={selectedMedicine}
          type={modalType}
          onClose={() => setSelectedMedicine(null)}
          onSubmit={updateStock}
        />
      )}

    </Layout>
  );
}

export default Stock;
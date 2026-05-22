import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import MedicineDetailsModal from "../components/MedicineDetailsModal";
import Skeleton from "../components/Skeleton";
import { SlRefresh } from "react-icons/sl";
import {useSearchParams} from "react-router-dom";

function Medicines() {

  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const [search, setSearch] =useState(searchParams.get("search") || "");

const [newMedicine, setNewMedicine] = useState({
  name: "",
  category: "",
  price: "",
  quantity: "",
  supplier: "",
  manufacturer: "",
  expiryDate: "",
  image: "",
  description: ""
});

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin"||user?.role === "superadmin";

  useEffect(() => {
    fetchMedicines();
  }, []);

const fetchMedicines = async () => {

  try {

    setLoading(true);

    const res = await API.get("/medicines");

    const sorted = res.data.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    setMedicines(sorted);

  } catch (err) {

    toast.error(
      "Failed to fetch medicines"
    );

  } finally {

    setTimeout(() => {

      setLoading(false);

    }, 50);

  }
};

const deleteMedicine = async () => {

  try {

    await API.delete(
      `/medicines/${deleteId}`
    );

    toast.success(
      "Medicine deleted"
    );

    setDeleteOpen(false);

    setDeleteId(null);

    fetchMedicines();

  } catch (err) {

    toast.error(
      err.response?.data?.message ||
      "Delete failed"
    );

  }

};

  const filteredMedicines = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddMedicine = async () => {

  try {

    if (
      !newMedicine.name ||
      !newMedicine.price
    ) {

      toast.error(
        "Name and price required"
      );

      return;

    }

    await API.post(
      "/medicines",
      newMedicine
    );

    toast.success(
      "Medicine added"
    );

    setAddOpen(false);

    setNewMedicine({
      name: "",
      category: "",
      price: "",
      quantity: "",
      supplier: "",
      manufacturer: "",
      expiryDate: "",
      image: "",
      description: ""
    });

    fetchMedicines();

  } catch (err) {

    toast.error(
      err.response?.data?.message ||
      "Failed to add medicine"
    );

  }

};

const exportToExcel = () => {
  if (filteredMedicines.length === 0) {
    toast.error("No medicines to export");
    return;
  }

  const formattedData = filteredMedicines.map((m) => ({
    "Medicine Name": m.name,
    Category: m.category || "-",
    Price: `₹${m.price}`,
    Quantity: m.quantity,
    Supplier: m.supplier || "-",
    Manufacturer: m.manufacturer || "-",
    "Expiry Date": m.expiryDate
      ? new Date(m.expiryDate).toLocaleDateString("en-GB")
      : "-",
    Description: m.description || "-"
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  worksheet["!cols"] = [
    { wch: 25 },
    { wch: 20 },
    { wch: 12 },
    { wch: 12 },
    { wch: 25 },
    { wch: 25 },
    { wch: 18 },
    { wch: 40 }
  ];

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Medicines"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array"
  });

  const fileData = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
    }
  );

  const now = new Date();

  const formatted =now.toLocaleDateString("en-GB").replaceAll("/", "-") + "_" + now.toLocaleTimeString("en-GB").replaceAll(":", "-");

saveAs(
  fileData,
  `PharmaStock_${formatted}.xlsx`
);

  toast.success("Excel exported successfully");
};

  return (
    <Layout>

      {/* TOP */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div>

          <h1 className="text-2xl font-bold text-green-700">
            Medicines
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage pharmacy medicines inventory
          </p>

        </div>

        {/* SEARCH */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">

  {/* SEARCH */}

  <button
            onClick={fetchMedicines}
            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm hover:bg-gray-50 hover:shadow transition w-fit"
          >
  
            <SlRefresh className="text-gray-600" />
  
            <span className="text-sm font-medium text-gray-700">
              Refresh
            </span>
  
          </button>
  <input
    type="text"
    placeholder="Search medicine..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-72 bg-white"  />

  {/* ADD */}
  {isAdmin && (
    <>
    <button
      onClick={exportToExcel}
      className="bg-white border border-green-600 text-green-700 hover:bg-green-50 px-4 py-2 rounded-lg text-sm font-medium transition"
    >
      Export Excel
    </button>
    <button
      onClick={() => setAddOpen(true)}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
    >
      Add Medicine
    </button>
    </>
  )}

</div>

      </div>

      {/* GRID */}
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
          ) : filteredMedicines.length > 0 ? (

          filteredMedicines.map((m) => (

            <div
              key={m._id}
              onClick={() => {

                setSelectedMedicine(m);
                setDetailsOpen(true);

              }}
              className="bg-white rounded-xl shadow border border-gray-100 hover:shadow-md transition overflow-hidden cursor-pointer"
            >

              {/* IMAGE */}
              <img
                src={m.image || "https://placehold.co/600x400"}
                alt={m.name}
                className="w-full h-36 object-cover"
              />

              {/* BODY */}
              <div className="p-4">

                {/* NAME */}
                <div className="flex justify-between items-start gap-2">

                  <div>

                    <h2 className="text-base font-semibold text-gray-800">
                      {m.name}
                    </h2>

                    <p className="text-xs text-gray-500 mt-1">
                      {m.category}
                    </p>

                  </div>

                  {/* STOCK */}
                  <span className={`px-2 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${
                    m.quantity === 0
                      ? "bg-red-100 text-red-600"
                      : m.quantity <= 10
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}>

                    {m.quantity === 0 ? "Out" : `${m.quantity} Left`}

                  </span>

                </div>

                {/* DETAILS */}
                <div className="mt-4 space-y-1.5 text-xs">

                  <div className="flex justify-between">

                    <span className="text-gray-500">
                      Supplier
                    </span>

                    <span className="font-medium text-gray-700 truncate max-w-30">
                      {m.supplier || "-"}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-500">
                      Price
                    </span>

                    <span className="font-medium text-gray-700">
                      ₹{m.price}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-500">
                      Expiry
                    </span>

                    <span className="font-medium text-gray-700">

                      {m.expiryDate
                        ? new Date(m.expiryDate).toLocaleDateString("en-GB")
                        : "-"}

                    </span>

                  </div>

                </div>

                {/* BUTTONS */}
                {isAdmin && (

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex gap-2 mt-4"
                  >

                    <button
                      onClick={() => {

                        setSelectedMedicine(m);
                        setDetailsOpen(true);

                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded-lg text-sm transition"
                    >
                      View
                    </button>

                    <button
                      onClick={() => { setDeleteId(m._id);setDeleteOpen(true);}}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1.5 rounded-lg text-sm transition"
                    >
                      Delete
                    </button>

                  </div>

                )}

              </div>

            </div>

          ))

        ) : (

          <div className="col-span-full bg-white rounded-xl shadow p-8 text-center text-gray-500">

            No medicines found

          </div>

        )}

      </div>

      {/* MODAL */}
      {detailsOpen && selectedMedicine && (

        <MedicineDetailsModal
          medicine={selectedMedicine}
          onClose={() => setDetailsOpen(false)}
          fetchMedicines={fetchMedicines}
        />

      )}

      {/* ADD MODAL */}
{addOpen && (

  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-5">

      <div className="flex items-center justify-between mb-5">

        <div>

          <h2 className="text-xl font-semibold text-gray-800">
            Add Medicine
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Create new medicine entry
          </p>

        </div>

        <button
          onClick={() => setAddOpen(false)}
          className="text-gray-500 hover:text-red-500 text-xl"
        >
          ✕
        </button>

      </div>

      <div className="grid grid-cols-2 gap-3">

        <input
          type="text"
          placeholder="Medicine Name"
          value={newMedicine.name}
          onChange={(e) =>
            setNewMedicine({
              ...newMedicine,
              name: e.target.value
            })
          }
          className="border rounded-xl px-3 py-2.5 text-sm outline-none bg-gray-50"
        />

        <input
          type="text"
          placeholder="Category"
          value={newMedicine.category}
          onChange={(e) =>
            setNewMedicine({
              ...newMedicine,
              category: e.target.value
            })
          }
          className="border rounded-xl px-3 py-2.5 text-sm outline-none bg-gray-50"
        />

        <input
          type="number"
          placeholder="Price"
          value={newMedicine.price}
          onChange={(e) =>
            setNewMedicine({
              ...newMedicine,
              price: e.target.value
            })
          }
          className="border rounded-xl px-3 py-2.5 text-sm outline-none bg-gray-50 no-spinner"
        />

        <input
          type="number"
          placeholder="Quantity"
          value={newMedicine.quantity}
          onChange={(e) =>
            setNewMedicine({
              ...newMedicine,
              quantity: e.target.value
            })
          }
          className="border rounded-xl px-3 py-2.5 text-sm outline-none bg-gray-50 no-spinner"
        />

        <input
          type="text"
          placeholder="Supplier"
          value={newMedicine.supplier}
          onChange={(e) =>
            setNewMedicine({
              ...newMedicine,
              supplier: e.target.value
            })
          }
          className="border rounded-xl px-3 py-2.5 text-sm outline-none bg-gray-50"
        />

        <input
          type="text"
          placeholder="Manufacturer"
          value={newMedicine.manufacturer}
          onChange={(e) =>
            setNewMedicine({
              ...newMedicine,
              manufacturer: e.target.value
            })
          }
          className="border rounded-xl px-3 py-2.5 text-sm outline-none bg-gray-50"
        />

        <input
          type="date"
          value={newMedicine.expiryDate}
          onChange={(e) =>
            setNewMedicine({
              ...newMedicine,
              expiryDate: e.target.value
            })
          }
          className="border rounded-xl px-3 py-2.5 text-sm outline-none bg-gray-50"
        />

        <input
          type="text"
          placeholder="Image URL"
          value={newMedicine.image}
          onChange={(e) =>
            setNewMedicine({
              ...newMedicine,
              image: e.target.value
            })
          }
          className="border rounded-xl px-3 py-2.5 text-sm outline-none bg-gray-50"
        />

      </div>

      <textarea
        rows="3"
        placeholder="Description"
        value={newMedicine.description}
        onChange={(e) =>
          setNewMedicine({
            ...newMedicine,
            description: e.target.value
          })
        }
        className="w-full mt-3 border rounded-xl px-3 py-2.5 text-sm outline-none bg-gray-50 resize-none"
      />

      <button
        onClick={handleAddMedicine}
        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-medium transition"
      >
        Add Medicine
      </button>

    </div>

  </div>

)}

{/* DELETE MODAL */}
{deleteOpen && (

  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">

      {/* HEADER */}
      <div className="p-5 border-b border-gray-100">

        <h2 className="text-lg font-semibold text-gray-800">
          Delete Medicine
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          This action cannot be undone
        </p>

      </div>

      {/* BODY */}
      <div className="p-5">

        <div className="bg-red-50 border border-red-100 rounded-xl p-4">

          <p className="text-sm text-red-600 leading-6">

            Are you sure you want to
            permanently delete this
            medicine?

          </p>

        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-5">

          <button
            onClick={() => {

              setDeleteOpen(false);

              setDeleteId(null);

            }}
            className="flex-1 border border-gray-300 hover:bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-medium transition"
          >
            Cancel
          </button>

          <button
            onClick={deleteMedicine}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-medium transition"
          >
            Delete
          </button>

        </div>

      </div>

    </div>

  </div>

)}

    </Layout>
  );
}

export default Medicines;
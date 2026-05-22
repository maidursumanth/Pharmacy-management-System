import { useState } from "react";

import {
  FiX,
  FiEdit,
  FiSave
} from "react-icons/fi";

import {
  FiEye,
  FiEyeOff
} from "react-icons/fi";

import Barcode from "react-barcode";

import API from "../services/api";

import toast from "react-hot-toast";

function MedicineDetailsModal({
  medicine,
  onClose,
  fetchMedicines
}) {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const isAdmin =
    user?.role === "admin"|| user?.role === "superadmin";

  const [editMode, setEditMode] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [showBarcode, setShowBarcode] =
    useState(false);

  const [formData, setFormData] =
    useState({

      name:
        medicine.name || "",

      category:
        medicine.category || "",

      price:
        medicine.price || "",

      quantity:
        medicine.quantity || "",

      supplier:
        medicine.supplier || "",

      manufacturer:
        medicine.manufacturer || "",

      expiryDate:
        medicine.expiryDate
          ?.split("T")[0] || "",

      image:
        medicine.image || "",

      description:
        medicine.description || "",

      barcode:
        medicine.barcode ||
        `PHARMA-${medicine._id.slice(-8)}`,

      batchNo:
        medicine.batchNo || ""

    });

  const daysLeft = Math.ceil(
    (
      new Date(
        medicine.expiryDate
      ) - new Date()
    ) /
    (1000 * 60 * 60 * 24)
  );

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value
    });

  };

  const handleSave = async () => {

    try {

      setLoading(true);

      const oldQuantity =
        medicine.quantity;

      const newQuantity =
        Number(formData.quantity);

      if (newQuantity < 0) {

        toast.error(
          "Quantity cannot be negative"
        );

        setLoading(false);

        return;
      }

      const medicinePayload = {

        name:
          formData.name,

        category:
          formData.category,

        price:
          formData.price,

        supplier:
          formData.supplier,

        manufacturer:
          formData.manufacturer,

        expiryDate:
          formData.expiryDate,

        image:
          formData.image,

        description:
          formData.description,

        barcode:
          formData.barcode,

        batchNo:
          formData.batchNo

      };

      await API.put(
        `/medicines/${medicine._id}`,
        medicinePayload
      );

      const difference =
        newQuantity - oldQuantity;

      if (difference > 0) {

        await API.patch(
          `/stock/${medicine._id}`,
          {
            quantity:
              difference,
            type: "ADD"
          }
        );

      } else if (
        difference < 0
      ) {

        if (
          Math.abs(difference) >
          oldQuantity
        ) {

          toast.error(
            "Insufficient stock"
          );

          setLoading(false);

          return;
        }

        await API.put(
          `/stock/update/${medicine._id}`,
          {
            quantity:
              Math.abs(difference),
            type: "REMOVE"
          }
        );
      }

      toast.success(
        "Medicine updated"
      );

      fetchMedicines();

      setEditMode(false);

    } catch (err) {

      toast.error(
        err.response?.data?.error ||
        "Update failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">

      {/* MODAL */}
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">

          <div>

            <h2 className="text-2xl font-semibold text-gray-800">
              Medicine Details
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              View and manage medicine information
            </p>

          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition"
          >

            <FiX size={20} />

          </button>

        </div>

        {/* BODY */}
        <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-8 p-6 max-h-[85vh] overflow-y-auto">

          {/* LEFT */}
          <div>

            {/* IMAGE */}
            <div className="bg-gray-100 rounded-2xl overflow-hidden h-[320px]">

              <img
                src={
                  formData.image ||
                  "https://placehold.co/600x600"
                }
                alt={formData.name}
                className="w-full h-full object-cover"
              />

            </div>

            {/* BADGES */}
            <div className="flex gap-2 mt-4 flex-wrap">

              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                medicine.quantity === 0
                  ? "bg-red-100 text-red-600"
                  : medicine.quantity <= 10
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}>

                {medicine.quantity === 0
                  ? "Out Of Stock"
                  : medicine.quantity <= 10
                  ? "Low Stock"
                  : "In Stock"}

              </span>

              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                daysLeft <= 30
                  ? "bg-orange-100 text-orange-700"
                  : "bg-blue-100 text-blue-700"
              }`}>

                {daysLeft > 0
                  ? `${daysLeft} days left`
                  : "Expired"}

              </span>

            </div>

            {/* BARCODE BUTTON */}
            <button
              onClick={() =>
                setShowBarcode(
                  !showBarcode
                )
              }
              className="mt-5 w-full flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 rounded-xl py-3 text-sm font-medium transition"
            >

              {showBarcode
                ? <FiEyeOff />
                : <FiEye />
              }

              {showBarcode
                ? "Hide Barcode"
                : "View Barcode"}

            </button>

            {/* BARCODE */}
            {showBarcode && (

              <div className="mt-4 bg-white border border-gray-200 rounded-2xl p-4 flex justify-center overflow-auto">

                <Barcode
                  value={formData.barcode}
                  width={1.5}
                  height={70}
                  fontSize={14}
                  displayValue={true}
                />

              </div>

            )}

          </div>

          {/* RIGHT */}
          <div className="space-y-5">

            {/* NAME */}
            <div>

              <label className="text-xs font-medium text-gray-500">
                Medicine Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                disabled={!editMode}
                onChange={handleChange}
                className="w-full mt-1 border rounded-xl px-4 py-3 text-sm outline-none bg-gray-50"
              />

            </div>

            {/* CATEGORY */}
            <div>

              <label className="text-xs font-medium text-gray-500">
                Category
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                disabled={!editMode}
                onChange={handleChange}
                className="w-full mt-1 border rounded-xl px-4 py-3 text-sm outline-none bg-gray-50"
              />

            </div>

            {/* PRICE + QUANTITY */}
            <div className="grid grid-cols-2 gap-4">

              <div>

                <label className="text-xs font-medium text-gray-500">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  disabled={!editMode}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-xl px-4 py-3 text-sm outline-none bg-gray-50 no-spinner"
                />

              </div>

              <div>

                <label className="text-xs font-medium text-gray-500">
                  Quantity
                </label>

                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  disabled={!editMode}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-xl px-4 py-3 text-sm outline-none bg-gray-50 no-spinner"
                />

              </div>

            </div>

            {/* SUPPLIER + MANUFACTURER */}
            <div className="grid grid-cols-2 gap-4">

              <div>

                <label className="text-xs font-medium text-gray-500">
                  Supplier
                </label>

                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  disabled={!editMode}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-xl px-4 py-3 text-sm outline-none bg-gray-50"
                />

              </div>

              <div>

                <label className="text-xs font-medium text-gray-500">
                  Manufacturer
                </label>

                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  disabled={!editMode}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-xl px-4 py-3 text-sm outline-none bg-gray-50"
                />

              </div>

            </div>

            {/* EXPIRY + BATCH */}
            <div className="grid grid-cols-2 gap-4">

              <div>

                <label className="text-xs font-medium text-gray-500">
                  Expiry Date
                </label>

                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  disabled={!editMode}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-xl px-4 py-3 text-sm outline-none bg-gray-50"
                />

              </div>

              <div>

                <label className="text-xs font-medium text-gray-500">
                  Batch Number
                </label>

                <input
                  type="text"
                  name="batchNo"
                  value={formData.batchNo}
                  disabled={!editMode}
                  onChange={handleChange}
                  placeholder="Enter batch number"
                  className="w-full mt-1 border rounded-xl px-4 py-3 text-sm outline-none bg-gray-50"
                />

              </div>

            </div>

            {/* BARCODE */}
            <div>

              <label className="text-xs font-medium text-gray-500">
                Barcode Number
              </label>

              <input
                type="text"
                name="barcode"
                value={formData.barcode}
                disabled
                className="w-full mt-1 border rounded-xl px-4 py-3 text-sm outline-none bg-gray-100 cursor-not-allowed"
              />

            </div>

            {/* IMAGE */}
            <div>

              <label className="text-xs font-medium text-gray-500">
                Image URL
              </label>

              <input
                type="text"
                name="image"
                value={formData.image}
                disabled={!editMode}
                onChange={handleChange}
                className="w-full mt-1 border rounded-xl px-4 py-3 text-sm outline-none bg-gray-50"
              />

            </div>

            {/* DESCRIPTION */}
            <div>

              <label className="text-xs font-medium text-gray-500">
                Description
              </label>

              <textarea
                rows="4"
                name="description"
                value={formData.description}
                disabled={!editMode}
                onChange={handleChange}
                className="w-full mt-1 border rounded-xl px-4 py-3 text-sm outline-none bg-gray-50 resize-none"
              />

            </div>

            {/* BUTTON */}
            {isAdmin && (

              <div className="pt-2">

                {!editMode ? (

                  <button
                    onClick={() =>
                      setEditMode(true)
                    }
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-sm transition"
                  >

                    <FiEdit size={16} />

                    Edit Medicine

                  </button>

                ) : (

                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-xl text-sm transition"
                  >

                    <FiSave size={16} />

                    {loading
                      ? "Saving..."
                      : "Save Changes"}

                  </button>

                )}

              </div>

            )}

          </div>

        </div>

      </div>

    </div>

  );
}

export default MedicineDetailsModal;
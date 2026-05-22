import { useState } from "react";

function StockModal({
  medicine,
  type,
  onClose,
  onSubmit
}) {

  const [quantity, setQuantity] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl p-6 w-[350px] shadow-xl">

        <h2 className="text-xl font-semibold mb-2">
          {type === "ADD"
            ? "Add Stock"
            : "Remove Stock"}
        </h2>

        <p className="text-gray-500 mb-4">
          {medicine.name}
        </p>

        <input
          type="number"
          placeholder="Enter quantity"
          className="w-full no-spinner border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-300"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value)
          }
        />

        <div className="flex gap-2 mt-5">

          <button
            onClick={onClose}
            className="flex-1 border py-2 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onSubmit(Number(quantity))
            }
            className={`flex-1 text-white py-2 rounded-xl ${
              type === "ADD"
                ? "bg-green-600"
                : "bg-red-500"
            }`}
          >
            Confirm
          </button>

        </div>

      </div>

    </div>
  );
}

export default StockModal;
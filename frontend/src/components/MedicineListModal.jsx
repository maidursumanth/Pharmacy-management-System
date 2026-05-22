function MedicineListModal({
  title,
  medicines,
  onClose
}) {

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      {/* MODAL */}
      <div className="bg-white w-175 max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b">

          <h2 className="text-2xl font-bold text-gray-800">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            ✕
          </button>

        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto max-h-[65vh]">

          {medicines.length > 0 ? (

            <div className="space-y-4">

              {medicines.map((m) => (

                <div
                  key={m._id}
                  className="flex items-center gap-4 border rounded-2xl p-4 hover:bg-gray-50 transition"
                >

                  {/* IMAGE */}
                  <img
                    src={
                      m.image ||
                      "https://placehold.co/80x80"
                    }
                    alt={m.name}
                    className="w-20 h-20 rounded-2xl object-cover border"
                  />

                  {/* DETAILS */}
                  <div className="flex-1">

                    <h3 className="text-lg font-semibold text-gray-800">
                      {m.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {m.category}
                    </p>

                    <div className="flex gap-4 mt-3 text-sm">

                      <span className="text-gray-600">
                        Qty:{" "}
                        <span className="font-medium">
                          {m.quantity}
                        </span>
                      </span>

                      <span className="text-gray-600">
                        ₹{m.price}
                      </span>

                      <span className="text-gray-600">
                        Exp:
                        {" "}
                        {new Date(
                          m.expiryDate
                        ).toLocaleDateString(
                          "en-GB"
                        )}
                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <div className="text-center py-10 text-gray-500">

              No medicines found

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default MedicineListModal;
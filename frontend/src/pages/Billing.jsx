import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import {Html5QrcodeScanner} from "html5-qrcode";
import API from "../services/api";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Skeleton from "../components/Skeleton";
import {FiSearch,FiTrash2} from "react-icons/fi";
import { SlRefresh } from "react-icons/sl";

function Billing() {
  const [medicines, setMedicines] =useState([]);
  const [search, setSearch] =useState("");
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] =useState("");
  const [shopName, setShopName] =useState("");
  const [loading, setLoading] =useState(true);
  const [showScanner, setShowScanner] =useState(false);

  // FETCH
  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res =await API.get("/medicines");
      setMedicines(res.data);
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

  // FILTER
const filteredMedicines =
  medicines.filter((m) => {

    const query =
      search.toLowerCase();

    return (

      m.name
        ?.toLowerCase()
        .includes(query)

      ||

      m.barcode
        ?.toLowerCase()
        .includes(query)

      ||

      m.batchNo
        ?.toLowerCase()
        .includes(query)

    );

  });

  // ADD TO CART
  const addToCart = (medicine) => {
    const existing =
      cart.find(
        (item) =>
          item.medicineId === medicine._id
      );

    if (existing) {
      setCart(
        cart.map((item) =>
          item.medicineId === medicine._id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
                subtotal:
                  (item.quantity + 1) *
                  item.price
              }
            : item
        )
      );

    } else {
      setCart([
        ...cart,
        {
          medicineId: medicine._id,
          medicineName: medicine.name,
          price: medicine.price,
          quantity: 1,
          subtotal: medicine.price
        }
      ]);
    }

    toast.success("Added to cart");
  };

  // UPDATE QUANTITY
  const updateQuantity = (
    medicineId,
    quantity
  ) => {

    if (quantity <= 0) {

      removeItem(medicineId);

      return;
    }

    setCart(
      cart.map((item) =>
        item.medicineId === medicineId
          ? {
              ...item,
              quantity,
              subtotal:
                quantity * item.price
            }
          : item
      )
    );
  };

  // REMOVE
  const removeItem = (medicineId) => {

    setCart(
      cart.filter(
        (item) =>
          item.medicineId !== medicineId
      )
    );
  };

  // TOTAL
  const totalAmount = useMemo(() => {
    return cart.reduce(
      (acc, item) =>
        acc + item.subtotal,
      0
    );

  }, [cart]);

  // PDF
  const downloadPDF = (billNumber) => {

    const doc = new jsPDF();
    const primary = [22, 163, 74];
    const dark = [31, 41, 55];
    const light = [107, 114, 128];
    // HEADER
    doc.setFillColor(...primary);
    doc.rect(0, 0, 210, 35, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("PharmaStock", 14, 18);
    doc.setFontSize(11);
    doc.setFont(
      "helvetica",
      "normal"
    );
    doc.text(
      "Pharmacy Management Invoice",
      14,
      27
    );

    // RESET
    doc.setTextColor(...dark);
    doc.setDrawColor(
      220,
      220,
      220
    );

    doc.roundedRect(
      14,
      45,
      182,
      42,
      3,
      3
    );

    // LEFT INFO
    doc.setFontSize(11);
    doc.setFont(
      "helvetica",
      "bold"
    );
    doc.text(
      "Customer Name",
      20,
      58
    );
    doc.setFont(
      "helvetica",
      "normal"
    );
    doc.text(
      customerName ||
      "Walk-in Customer",
      20,
      66
    );
    doc.setFont(
      "helvetica",
      "bold"
    );
    doc.text(
      "Shop Name",
      20,
      78
    );
    doc.setFont(
      "helvetica",
      "normal"
    );
    doc.text(
      shopName || "N/A",
      20,
      86
    );

    // RIGHT INFO
    doc.setFont(
      "helvetica",
      "bold"
    );
    doc.text(
      "Invoice No",
      120,
      58
    );
    doc.setFont(
      "helvetica",
      "normal"
    );
    doc.text(
      billNumber,
      120,
      66
    );
    doc.setFont(
      "helvetica",
      "bold"
    );
    doc.text(
      "Date",
      120,
      78
    );
    doc.setFont(
      "helvetica",
      "normal"
    );
    doc.text(
      new Date().toLocaleString(),
      120,
      86
    );

    // TABLE
    autoTable(doc, {
      startY: 105,
      head: [[
        "Medicine",
        "Qty",
        "Price",
        "Subtotal"
      ]],
      body: cart.map((item) => ([
        item.medicineName,
        item.quantity,
        `Rs ${Number(item.price)}`,
        `Rs ${Number(item.subtotal)}`
      ])),
      styles: {
        fontSize: 11,
        cellPadding: 5,
        textColor: [
          31,
          41,
          55
        ],
        lineColor: [
          230,
          230,
          230
        ],
        lineWidth: 0.2
      },
      headStyles: {
        fillColor: primary,
        textColor: [
          255,
          255,
          255
        ],
        fontStyle: "bold",
        halign: "center"
      },
      bodyStyles: {
        fillColor: [
          255,
          255,
          255
        ]
      },
      alternateRowStyles: {
        fillColor: [
          245,
          245,
          245
        ]
      },
      columnStyles: {
        1: {
          halign: "center"
        },
        2: {
          halign: "center"
        },
        3: {
          halign: "center"
        }
      }
    });

    // TOTAL
    const finalY =
      doc.lastAutoTable.finalY;

    doc.setFillColor(
      240,
      253,
      244
    );

    doc.roundedRect(
      120,
      finalY + 12,
      76,
      18,
      3,
      3,
      "F"
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(14);

    doc.setTextColor(...primary);

    doc.text(
      `Total: Rs ${Number(totalAmount)}`,
      128,
      finalY + 24
    );

    // FOOTER
    doc.setFontSize(11);

    doc.setTextColor(...light);

    doc.setFont(
      "helvetica",
      "italic"
    );

    doc.text(
      "Thank you for visiting PharmaStock",
      14,
      finalY + 50
    );

    doc.text(
      "Generated by PharmaStock Management System",
      14,
      finalY + 58
    );

    doc.save(
      `${billNumber}.pdf`
    );
  };

  // BILL
  const generateBill = async () => {

    if (!customerName.trim()) {

      toast.error(
        "Customer name required"
      );

      return;
    }

    if (!shopName.trim()) {

      toast.error(
        "Shop name required"
      );

      return;
    }

    if (cart.length === 0) {

      toast.error(
        "Cart is empty"
      );

      return;
    }

    try {

      const res = await API.post(
        "/sales/create",
        {
          items: cart,
          totalAmount,
          customerName
        }
      );

      toast.success(
        res.data.message
      );

      const billNumber =
        res.data.sale.billNumber;

      try {

        downloadPDF(
          billNumber
        );

      } catch (pdfError) {

        console.log(pdfError);

        toast.error(
          "PDF generation failed"
        );
      }

      setCart([]);

      setCustomerName("");

      setShopName("");

      fetchMedicines();

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Billing failed"
      );
    }
  };

useEffect(() => {

  if (!showScanner) return;

  let scanner;

  const startScanner =
    async () => {

      try {

        scanner =
          new Html5QrcodeScanner(
            "reader",
            {
              fps: 15,
              qrbox: {
                width: 250,
                height: 120
              },
              aspectRatio: 1.7
            },
            false
          );

        scanner.render(

          (decodedText) => {

            setSearch(
              decodedText.trim()
            );

            toast.success(
              "Barcode scanned"
            );

            setShowScanner(false);

            scanner.clear();

          },

          () => {}

        );

      } catch (error) {

        console.log(error);

        toast.error(
          "Camera failed to open"
        );

      }

    };

  // WAIT FOR MODAL RENDER
  setTimeout(() => {

    startScanner();

  }, 300);

  return () => {

    if (scanner) {

      scanner.clear()
        .catch(() => {});

    }

  };

}, [showScanner]);

  return (

    <Layout>

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Billing System
          </h1>

          <p className="text-gray-500 mt-1">
            Generate pharmacy bills
          </p>

        </div>

        {/* REFRESH */}
        <button
          onClick={fetchMedicines}
          className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm hover:bg-gray-50 hover:shadow transition w-fit"
        >

          <SlRefresh className="text-gray-600" />

          <span className="text-sm font-medium text-gray-700">
            Refresh
          </span>

        </button>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* LEFT */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow p-5">

          {/* SEARCH */}
          <div className="flex items-center gap-3 mb-5">

            {/* SEARCH BAR */}
            <div className="flex items-center flex-1 bg-gray-100 rounded-lg px-3 py-2 border border-gray-200">

              <FiSearch
                className="text-gray-400"
                size={16}
              />

              <input
                type="text"
                placeholder="Search medicines, barcode, batch..."
                className="ml-2 bg-transparent outline-none w-full text-sm"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            {/* SCANNER BUTTON */}
            <button
              onClick={() =>
                setShowScanner(true)
              }
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition whitespace-nowrap"
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 12h10"
                />

              </svg>

              Scan

            </button>

          </div>

          {/* MEDICINES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-175 overflow-y-auto pr-1">

            {loading ? (

              <>
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
                  className="border rounded-2xl p-4 hover:shadow-md transition"
                >

                  <div className="flex gap-4">

                    <img
                      src={
                        m.image ||
                        "https://placehold.co/300x200"
                      }
                      alt={m.name}
                      className="w-24 h-24 rounded-xl object-cover"
                    />

                    <div className="flex-1">

                      <h2 className="font-semibold text-gray-800">
                        {m.name}
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        {m.category}
                      </p>

                      <p className="text-green-600 font-bold mt-2">
                        ₹{m.price}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Stock: {m.quantity}
                      </p>

                      <button
                        onClick={() =>
                          addToCart(m)
                        }
                        disabled={
                          m.quantity === 0
                        }
                        className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                          m.quantity === 0
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        Add To Bill
                      </button>

                    </div>

                  </div>

                </div>

              ))
            )}

          </div>

        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-2xl shadow p-5 h-fit sticky top-5">

          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Bill Cart
          </h2>

          <div className="space-y-3 mb-5">

            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) =>
                setCustomerName(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="text"
              placeholder="Shop Name"
              value={shopName}
              onChange={(e) =>
                setShopName(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          {cart.length === 0 ? (

            <div className="text-gray-500 text-sm">
              No medicines added
            </div>

          ) : (

            <div className="space-y-4">

              {cart.map((item) => (

                <div
                  key={item.medicineId}
                  className="border rounded-xl p-3"
                >

                  <div className="flex justify-between items-start">

                    <div>

                      <h3 className="font-medium text-gray-800">
                        {item.medicineName}
                      </h3>

                      <p className="text-sm text-gray-500">
                        ₹{item.price}
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        removeItem(
                          item.medicineId
                        )
                      }
                      className="text-red-500 hover:text-red-600"
                    >

                      <FiTrash2 />

                    </button>

                  </div>

                  {/* QUANTITY */}
                  <div className="flex items-center gap-3 mt-4">

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.medicineId,
                          item.quantity - 1
                        )
                      }
                      className="w-8 h-8 rounded-lg bg-gray-100"
                    >
                      -
                    </button>

                    <span className="font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.medicineId,
                          item.quantity + 1
                        )
                      }
                      className="w-8 h-8 rounded-lg bg-gray-100"
                    >
                      +
                    </button>

                  </div>

                  {/* SUBTOTAL */}
                  <div className="mt-3 text-sm text-gray-600">

                    Subtotal:

                    <span className="font-semibold text-gray-800 ml-1">
                      ₹{item.subtotal}
                    </span>

                  </div>

                </div>

              ))}

              {/* TOTAL */}
              <div className="border-t pt-4">

                <div className="flex justify-between items-center">

                  <span className="text-lg font-semibold text-gray-700">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-green-600">
                    ₹{totalAmount}
                  </span>

                </div>

                <button
                  onClick={generateBill}
                  className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition"
                >
                  Generate Bill
                </button>

              </div>

            </div>

          )}

        </div>

      </div>

      {/* SCANNER MODAL */}
{showScanner && (

  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">

    <div className="bg-white rounded-2xl p-5 w-full max-w-md">

      <div className="flex items-center justify-between mb-4">

        <h2 className="text-xl font-semibold">
          Scan Barcode
        </h2>

        <button
          onClick={() =>
            setShowScanner(false)
          }
          className="text-red-500 font-medium"
        >
          Close
        </button>

      </div>

      <div className="overflow-hidden rounded-xl">

        <div
          id="reader"
          className="rounded-xl overflow-hidden"
        />

      </div>

    </div>

  </div>

)}

    </Layout>
  );
}

export default Billing;
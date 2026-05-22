import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import StockChart from "../components/StockChart";
import RecentActivity from "../components/RecentActivity";
import Skeleton from "../components/Skeleton";
import MedicineListModal from "../components/MedicineListModal";
import { SlRefresh } from "react-icons/sl";
import toast from "react-hot-toast";

function Dashboard() {

  const [Total, setTotal] = useState(0);
  const [LowStock, setLowStock] = useState(0);
  const [OutofStock, setOutofStock] = useState(0);
  const [ExpiryingSoon, setExpiryingSoon] = useState(0);
  const [expiredMedicines, setExpiredMedicines] = useState(0);

  const [loading, setLoading] = useState(true);

  // MODAL
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMedicines, setModalMedicines] = useState([]);

  // LISTS
  const [allMedicines, setAllMedicines] = useState([]);
  const [lowMedicines, setLowMedicines] = useState([]);
  const [outMedicines, setOutMedicines] = useState([]);
  const [expiryMedicines, setExpiryMedicines] = useState([]);
  const [expired, setExpired] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      setLoading(true);

      // ALL
      const medicines = await API.get("/medicines");

      setAllMedicines(medicines.data);
      setTotal(medicines.data.length);

      // EXPIRING
      const expiry = await API.get("/medicines/expiring-soon");

      setExpiryMedicines(expiry.data);
      setExpiryingSoon(expiry.data.length);

      // EXPIRED
      const expiredData = await API.get("/medicines/expired");

      setExpired(expiredData.data);
      setExpiredMedicines(expiredData.data.length);

      // LOW STOCK
      const low = await API.get("/medicines/low-stock");

      setLowMedicines(low.data);
      setLowStock(low.data.length);

      // OUT OF STOCK
      const os = await API.get("/medicines/outofstock");

      setOutMedicines(os.data || []);
      setOutofStock(os.data.length || 0);

    } catch (err) {
      toast.error("Unable to Fetch Data, Please try again.")
      console.log(err);

    } finally {

      setTimeout(() => {

        setLoading(false);

      }, 50);

    }
  };

  return (
    <Layout>

      {/* TOP */}
      <div className="flex items-center justify-between mb-6">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Pharmacy inventory overview
          </p>

        </div>

        {/* REFRESH */}
        <button
          onClick={fetchData}
          className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm hover:bg-gray-50 hover:shadow transition"
        >

          <SlRefresh className="text-gray-600 text-lg" />

          <span className="text-sm font-medium text-gray-700">
            Refresh
          </span>

        </button>

      </div>

      {/* CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">

        {loading ? (

          <>
            <Skeleton type="card" />
            <Skeleton type="card" />
            <Skeleton type="card" />
            <Skeleton type="card" />
            <Skeleton type="card" />
          </>

        ) : (

          <>

            {/* TOTAL */}
            <div
              onClick={() => {

                setModalTitle("All Medicines");
                setModalMedicines(allMedicines);
                setModalOpen(true);

              }}
              className="cursor-pointer"
            >

              <Card
                title="Total Medicines"
                value={Total}
                color="green"
              />

            </div>

            {/* LOW */}
            <div
              onClick={() => {

                setModalTitle("Low Stock Medicines");
                setModalMedicines(lowMedicines);
                setModalOpen(true);

              }}
              className="cursor-pointer"
            >

              <Card
                title="Low Stock"
                value={LowStock}
                color="blue"
              />

            </div>

            {/* EXPIRING */}
            <div
              onClick={() => {

                setModalTitle("Expiring Soon");
                setModalMedicines(expiryMedicines);
                setModalOpen(true);

              }}
              className="cursor-pointer"
            >

              <Card
                title="Expiring Soon"
                value={ExpiryingSoon}
                color="orange"
              />

            </div>

            {/* EXPIRED */}
            <div
              onClick={() => {

                setModalTitle("Expired Medicines");
                setModalMedicines(expired);
                setModalOpen(true);

              }}
              className="cursor-pointer"
            >

              <Card
                title="Expired"
                value={expiredMedicines}
                color="gray"
              />

            </div>

            {/* OUT OF STOCK */}
            <div
              onClick={() => {

                setModalTitle("Out Of Stock");
                setModalMedicines(outMedicines);
                setModalOpen(true);

              }}
              className="cursor-pointer"
            >

              <Card
                title="Out Of Stock"
                value={OutofStock}
                color="red"
              />

            </div>

          </>

        )}

      </div>

      {/* GRAPH + ACTIVITY */}
      {/* GRAPH + ACTIVITY */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">

          {loading ? (

            <div className="bg-white rounded-2xl shadow p-5 animate-pulse h-[420px]">

              <div className="h-5 bg-gray-200 rounded w-40 mb-6" />

              <div className="h-[320px] bg-gray-100 rounded-xl" />

            </div>

          ) : (

            <StockChart
              total={Total}
              low={LowStock}
              out={OutofStock}
              expiring={ExpiryingSoon}
              expired={expiredMedicines}
            />

          )}

          {loading ? (

            <div className="bg-white rounded-2xl shadow p-5">

              <Skeleton type="activity" />
              <Skeleton type="activity" />
              <Skeleton type="activity" />
              <Skeleton type="activity" />

            </div>

          ) : (

            <RecentActivity />

          )}

        </div>

      {/* MODAL */}
      {modalOpen && (

        <MedicineListModal
          title={modalTitle}
          medicines={modalMedicines}
          onClose={() => setModalOpen(false)}
        />

      )}

    </Layout>
  );
}

function Card({ title, value, color }) {

  const colors = {
    green: "text-green-500",
    blue: "text-blue-500",
    red: "text-red-500",
    orange: "text-orange-500",
    gray: "text-gray-700"
  };

  const borderColors = {
    green: "border-green-500",
    blue: "border-blue-500",
    red: "border-red-500",
    orange: "border-orange-500",
    gray: "border-gray-500"
  };

  return (
    <div className={`bg-white p-4 rounded-xl shadow border-t-4 hover:shadow-lg transition ${borderColors[color]}`}>

      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className={`text-2xl font-bold mt-2 ${colors[color]}`}>
        {value}
      </h2>

    </div>
  );
}

export default Dashboard;
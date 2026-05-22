import {
  FiSearch,
  FiBell,
  FiLogOut,
  FiAlertCircle,
  FiPackage
} from "react-icons/fi";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  useEffect,
  useRef,
  useState
} from "react";

import API from "../services/api";

function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [showSuggestions,setShowSuggestions] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef();
  const previousNotifications = useRef([]);

  // 🔥 USER
  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 PAGE TITLES
  const titles = {
    "/dashboard": "Dashboard",
    "/medicines": "Medicines",
    "/stock": "Stock Management",
    "/profile": "Profile",
    "/admin": "Admin Panel"
  };

  const pageTitle = titles[location.pathname] || "PharmaStock";

  // 🔥 FETCH DATA
  useEffect(() => {

    fetchMedicines();
    fetchNotifications();

    // 🔥 REALTIME REFRESH
    const interval = setInterval(() => {

      fetchNotifications();

    }, 10000);

    return () => clearInterval(interval);

  }, []);

  // 🔥 FETCH MEDICINES
  const fetchMedicines = async () => {

    try {

      const res = await API.get(
        "/medicines"
      );

      setMedicines(res.data);

    } catch (err) {

      console.log(err);

    }
  };

  // 🔥 FETCH NOTIFICATIONS
  const fetchNotifications = async () => {
  try {

    const res = await API.get("/medicines");
    const meds = res.data;
    let alerts = [];
    let hasNewNotification = false;

    meds.forEach((m) => {

      // EXPIRED
      if (
        m.expiryDate &&
        new Date(m.expiryDate) < new Date()
      ) {

        alerts.push({
          type: "expired",
          text: `${m.name} has expired`
        });

        hasNewNotification = true;
      }

      // EXPIRING SOON
      else if (m.expiryDate) {

        const expiry = new Date(m.expiryDate);

        const today = new Date();

        const diff =
          Math.ceil(
            (expiry - today) /
            (1000 * 60 * 60 * 24)
          );

        if (diff <= 30) {

          alerts.push({
            type: "expiring",
            text: `${m.name} expires in ${diff} days`
          });

          hasNewNotification = true;
        }
      }

      // OUT OF STOCK
      if (m.quantity === 0) {

        alerts.push({
          type: "out",
          text: `${m.name} is out of stock`
        });

        hasNewNotification = true;
      }

      // LOW STOCK
      else if (m.quantity <= 10) {

        alerts.push({
          type: "low",
          text: `${m.name} is low on stock`
        });

        hasNewNotification = true;
      }

    });

    // SOUND
    const storedNotifications =
  JSON.parse(
    localStorage.getItem(
      "seenNotifications"
    )
  ) || [];

const newAlerts = alerts.filter(
  (alert) =>
    !storedNotifications.includes(
      alert.text
    )
);

// PLAY SOUND ONLY FOR NEW ALERTS
if (newAlerts.length > 0) {

  const audio = new Audio(
    "/notification.mp3"
  );

  audio.play();

}

// SAVE ALERTS
localStorage.setItem(
  "seenNotifications",
  JSON.stringify(
    alerts.map((a) => a.text)
  )
);

    setNotifications(alerts);

  } catch (err) {

    console.log(err);

  }
};

  // 🔥 SEARCH FILTER
  const filteredMedicines =
    medicines.filter((m) =>
      m.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  // 🔥 LOGOUT
  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/");

  };

  // 🔥 CLOSE MODAL
  useEffect(() => {

    const handleClickOutside =
      (e) => {

      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          e.target
        )
      ) {

        setShowNotifications(
          false
        );
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  return (
    <div className="h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-50">

      {/* LEFT */}
      <div>

        <h1 className="text-2xl font-bold text-gray-800">
          {pageTitle}
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Welcome back,{" "}
            <span className="font-medium text-gray-700">
              {user?.name || "User"}
            </span>
        </p>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* SEARCH */}
        <div className="relative hidden md:block">

          <div className="flex items-center bg-gray-100 px-4 py-2 rounded-2xl w-72">

            <FiSearch className="text-gray-400" />

            <input
              type="text"
              placeholder="Search medicines..."
              className="bg-transparent outline-none ml-3 w-full text-sm"
              value={search}
              onChange={(e) => {

                setSearch(
                  e.target.value
                );

                setShowSuggestions(
                  true
                );

              }}
            />

          </div>

          {/* SEARCH SUGGESTIONS */}
          {showSuggestions &&
            search &&
            filteredMedicines.length > 0 && (

            <div className="absolute top-14 w-full bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden z-50">

              {filteredMedicines
                .slice(0, 5)
                .map((m) => (

                <div
                  key={m._id}
                  onClick={() => {

                    navigate(
                      `/medicines?search=${m.name}`
                    );

                    setSearch("");

                    setShowSuggestions(
                      false
                    );

                  }}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b"
                >

                  <p className="font-medium text-gray-800">
                    {m.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {m.category}
                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* NOTIFICATIONS */}
        <div
          className="relative"
          ref={notificationRef}
        >

          <button
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
            className="relative w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
          >

            <FiBell
              size={20}
              className="text-gray-600"
            />

            {notifications.length > 0 && (

              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full" />

            )}

          </button>

          {/* NOTIFICATION MODAL */}
          {showNotifications && (

            <div className="absolute right-0 top-14 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">

              {/* HEADER */}
              <div className="p-4 border-b">

                <h2 className="font-semibold text-gray-800">
                  Notifications
                </h2>

              </div>

              {/* BODY */}
              <div className="max-h-80 overflow-y-auto">

                {notifications.length > 0 ? (

                  notifications.map(
                    (n, index) => (

                    <div
                      key={index}
                      className="flex gap-3 px-4 py-4 border-b hover:bg-gray-50"
                    >

                      <div
                        className={`mt-1 ${
                          n.type === "out"
                            ? "text-red-500"
                            : n.type === "expired"
                            ? "text-gray-600"
                            : n.type === "expiring"
                            ? "text-orange-500"
                            : "text-yellow-500"
                        }`}
                      >

                        {n.type === "out"
                          ? <FiAlertCircle />
                          : <FiPackage />
                        }

                      </div>

                      <div>

                        <p className="text-sm text-gray-800">
                          {n.text}
                        </p>

                      </div>

                    </div>

                  ))

                ) : (

                  <div className="p-6 text-center text-sm text-gray-500">

                    No notifications

                  </div>

                )}

              </div>

            </div>

          )}

        </div>

        {/* USER */}
        <div className="hidden md:flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-2xl cursor-pointer" onClick={()=>{navigate("/profile")}}>

          {user?.profileImage ? (

            <img
              src={user.profileImage}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />

          ) : (

            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">

              {user?.name?.charAt(0) || "U"}

            </div>

          )}

          <div>

            <p className="text-sm font-medium text-gray-800">
              {user?.name||"User"}
            </p>

            <p className="text-xs text-gray-500 capitalize">
              {user?.role}
            </p>

          </div>

        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 h-11 rounded-2xl bg-red-50 hover:bg-red-100 transition"
        >

          <FiLogOut
            size={18}
            className="text-red-500"
          />

          <span className="text-sm font-medium text-red-500">
            Logout
          </span>

        </button>

      </div>

    </div>
  );
}

export default Navbar;
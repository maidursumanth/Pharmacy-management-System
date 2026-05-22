import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* NAVBAR */}
        <Navbar />

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>

    </div>
  );
}

export default Layout;
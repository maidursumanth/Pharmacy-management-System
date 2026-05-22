import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectRoutes from "./components/ProtectRoutes";
import Medicines from "./pages/Medicines";
import Stock from "./pages/Stocks";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import ForgotPassword from "./pages/ForgotPassword";
import Billing from "./pages/Billing";
import RecentActivities from "./pages/RecentActivities";
import About from "./pages/About";
import AdminRoute from "./components/AdminRoute";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />}/>
        <Route path="/register" element={<Register />} />

        {/* NOT FOUND PAGE */}
        <Route path="*" element={<ProtectRoutes><NotFound /></ProtectRoutes>}/>

        {/* Protected */}
        <Route path="/dashboard" element={ <ProtectRoutes><Dashboard /></ProtectRoutes>}/>
        <Route path="/medicines" element={ <ProtectRoutes> <Medicines /> </ProtectRoutes>}/>
        <Route path="/stock"element={<ProtectRoutes><Stock /></ProtectRoutes>}/>
        <Route path="/about" element={<ProtectRoutes><About /></ProtectRoutes>}/>
        <Route path="/profile"element={<ProtectRoutes><Profile /></ProtectRoutes>}/>
        <Route path="/activities" element={<ProtectRoutes><RecentActivities /></ProtectRoutes>}/>

        {/* Admin Routes */}
        <Route path="/billing" element={<ProtectRoutes><AdminRoute><Billing /> </AdminRoute></ProtectRoutes>}/>
        <Route path="/admin" element={<ProtectRoutes><AdminRoute><Admin /> </AdminRoute></ProtectRoutes>}/>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Route, Routes, Navigate, Outlet} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminRoute from "./components/AdminRoute";
import UserRoute from "./components/UserRoute";
import ManageHospitals from "./pages/ManageHospitals";
import RemitFund from "./pages/RemitFund";
import Unauthorized from "./pages/Unauthorized";
import AddHospital from "./pages/AddHospital";
import ManageUsers from "./pages/ManageUsers";
import Logout from "./pages/Logout";
import PendingApprovals from "./pages/PendingApprovals";
import Transactions from "./pages/Transactions";
import EditHospital from "./pages/EditHospital";
import OpenTicket from "./pages/OpenTicket";
import AdminReports from "./pages/AdminReports";
import RemitterReports from "./pages/RemitterReports";
import MonthlyTarget from "./pages/MonthlyTarget";

// Main application component
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout/>} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/admin/unauthorized" element={<Unauthorized />} />
        <Route path="/user/unauthorized" element={<Unauthorized />} />

        {/* Protected common routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/open-ticket" element={<OpenTicket />} />
          <Route path="/monthly-target" element={<MonthlyTarget/>} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<AdminRoute />}>
          <Route path="/register" element={<Register />} />
          <Route path="/pending-approvals" element={<PendingApprovals/>} />
          <Route path="/manage-users" element={<ManageUsers />}/>
          <Route path="/add-hospital" element={<AddHospital/>} />
          <Route path="/edit-hospital/" element={<EditHospital />} />
          <Route path="/manage-hospitals" element={<ManageHospitals />} />
          <Route path="/add-hospital" element={<AddHospital/>}/>
          <Route path="/admin-reports" element={<AdminReports/>} />
        </Route>

        {/* Remitter-only routes */}
        <Route element={<UserRoute />}>
          <Route path="/remit-fund" element={<RemitFund />} />
          <Route path="/remitter-reports" element={<RemitterReports />} />
        </Route>

        {/* Catch-all for invalid routes */}
        <Route path="*" element={<Navigate to="/unauthorized" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// General protected layout (checks authentication only)
function ProtectedLayout() {
  const { authToken } = useAuth();
  return authToken ? <Outlet /> : <Navigate to="/login" replace />;
}

// Context wrapper component
function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWrapper;
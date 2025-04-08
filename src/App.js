import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminRoute from "./components/AdminRoute";
import UserRoute from "./components/UserRoute";
import ManageHospitals from "./pages/ManageHospitals";
// import RemitFund from "./pages/RemitFund";
import Unauthorized from "./pages/Unauthorized";

// Main application component
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected common routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<AdminRoute />}>
          <Route path="/manage-hospitals" element={<ManageHospitals />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Remitter-only routes */}
        <Route element={<UserRoute />}>
          {/* <Route path="/remit-fund" element={<RemitFund />} /> */}
        </Route>

        {/* Catch-all for invalid routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
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



// import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import Home from "./pages/Home";
// import Register from "./pages/Register";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";

// // Main application component
// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
        
//         {/* Protected routes */}
//         <Route element={<ProtectedLayout />}>
//           <Route path="/dashboard" element={<Dashboard />} />
//           {/* Add more protected routes here */}
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// // Protected layout component using context
// function ProtectedLayout() {
//   const { authToken } = useAuth();
//   return authToken ? <Outlet /> : <Navigate to="/login" replace />;
// }

// // Context wrapper component
// function AppWrapper() {
//   return (
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   );
// }

// export default AppWrapper;
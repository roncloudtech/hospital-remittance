import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Main application component
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add more protected routes here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// Protected layout component using context
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
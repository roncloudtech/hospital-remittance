import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Auth context

const Logout = () => {
  // Base API URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const { logout } = useAuth(); // Logout function from context

  useEffect(() => {
    const performLogout = async () => {
      try {
        await axios.post(
          `${API_BASE_URL ? API_BASE_URL : 'http://localhost:8000/api'}/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        logout(); // Clear local auth state
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
        logout(); // Force clear even if error (e.g., token already expired)
        navigate("/login");
      }
    };

    performLogout();
  }, [logout, navigate, API_BASE_URL]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-green-900">
          Logging you out...
        </h2>
        <p className="text-gray-600 mt-2">Please wait while we end your session.</p>
      </div>
    </div>
  );
};

export default Logout;
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const useIdleTimer = (timeout = 5 * 60 * 1000) => {
  // 5 minutes
  const navigate = useNavigate();
  const timerRef = useRef(null);
  // Base API URL
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const { logout } = useAuth(); // Logout function from context

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      handleLogout();
    }, timeout);
  };

  // Logout handler
  const handleLogout = () => {
    const performLogout = async () => {
      try {
        await axios.post(
          `${API_BASE_URL ? API_BASE_URL : "http://localhost:8000/api"}/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("military_token")}`,
              Accept: "application/json", // This helps Laravel respond with JSON and handle auth
            },
          }
        );

        logout(); // Clear local auth state
      } catch (error) {
        console.error("Logout failed:", error);
        logout(); // Force clear even if error (e.g., token already expired
      }
    };

    performLogout();
    // Clear user auth data (token/session/etc)
    localStorage.removeItem("military_token");
    localStorage.removeItem("user_data");
    navigate("/login");
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "scroll", "click"];

    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // Initialize on mount

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
};

export default useIdleTimer;

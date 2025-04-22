import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Auth context

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Logout function from context

  useEffect(() => {
    const performLogout = async () => {
      try {
        await axios.post(
          "http://localhost:8000/api/logout",
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
  }, [logout, navigate]);

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



















// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const Logout = () => {
//   const { logout } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const performLogout = async () => {
//       await logout();
//       navigate("/login");
//     };

//     performLogout();
//   }, [logout, navigate]);

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="text-center">
//         <div className="animate-spin mb-4 inline-block">
//           <svg className="w-12 h-12 text-green-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//           </svg>
//         </div>
//         <p className="text-lg text-green-900">Logging out...</p>
//       </div>
//     </div>
//   );
// };

// export default Logout;

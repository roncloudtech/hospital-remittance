import React, { useEffect, useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useIdleTimer from "../hooks/useIdleTimer";

export default function DashboardHeader({ PageTitle }) {
  useIdleTimer();
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const { user } = useAuth();

  const [unreadCount, setUnreadCount] = useState(0);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("military_token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch unread notification count
  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("military_token");

      const res = await fetch(
        `${
          API_BASE_URL ? API_BASE_URL : "http://localhost:8000/api"
        }/notifications/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // console.log("Fetching unread notifications count", res);

      if (res.ok) {
        const data = await res.json();
        console.log("Unread notifications count:", data.count);
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error("Failed to fetch unread notifications", error);
    }
  };

  // Load + poll every 30 seconds
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Left */}
        <div>
          <h1 className="text-2xl font-bold text-green-900">
            {PageTitle || "Dashboard"}
          </h1>
          <p className="text-sm text-gray-600">
            Welcome back, {user?.role === "admin" ? "Admin" : "Remitter"}{" "}
            {user?.firstname} {user?.lastname}
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6">
          {/* 🔔 Notification Bell */}

          {user?.role === "admin" && (
            <div
                className="relative cursor-pointer"
                onClick={() => navigate("/notifications")}
            >
                <BellIcon className="h-7 w-7 text-green-900" />
                {/* {unreadCount} */}
                {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                </span>
                )}
            </div>
          )}

          {/* User Info */}
          <div className="text-right">
            <p className="text-sm font-medium">
              {user?.firstname} {user?.lastname}
            </p>
            <p className="text-xs text-gray-600">Role: {user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

//  Previous version without notifications

// import React, { useEffect } from 'react';
// // import { UserCircleIcon } from '@heroicons/react/24/outline';
// import { useAuth } from '../context/AuthContext'; // Import the auth context
// import { useNavigate } from 'react-router-dom';
// import useIdleTimer from '../hooks/useIdleTimer';

// export default function DashboardHeader({PageTitle}) {
//     useIdleTimer();
//     const navigate = useNavigate();
//     const { user } = useAuth(); // Get user from context

//     // Check authentication status
//     useEffect(() => {
//     const token = localStorage.getItem('military_token');
//     if (!token) {
//         navigate('/login');
//     }
//     }, [navigate]);
//   return (
//     <>
//         <header className="bg-white shadow-sm">
//           <div className="flex justify-between items-center px-6 py-4">
//             <div>
//               <h1 className="text-2xl font-bold text-green-900">{PageTitle || "Dashbord Title"}</h1>
//               <p className="text-sm text-gray-600">
//                 Welcome back, {user?.role === 'admin' ? 'Admin' : 'Remitter'} {user?.firstname} {user?.lastname}
//               </p>
//             </div>
//             <div className="flex items-center">
//               {/* <UserCircleIcon className="h-8 w-8 text-green-900 mr-2" /> */}
//               <div>
//                 <p className="text-sm font-medium">
//                   {user?.firstname} {user?.lastname}
//                 </p>
//                 <p className="text-xs text-gray-600">Role: {user?.role}</p>
//               </div>
//             </div>
//           </div>
//         </header>
//     </>
//   )
// }

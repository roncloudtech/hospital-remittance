import React, { useEffect, useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardSideBar from "../components/DashboardSideBar";
import DashboardHeader from "../components/DashboardHeader";

export default function NotificationsPage() {
  // Base API URL
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const { authToken, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("military_token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    // Redirect if not admin
    if (user?.role !== "admin") {
      navigate("/unauthorized");
      return;
    }
  }, [navigate, token, user]);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        `${
          API_BASE_URL ? API_BASE_URL : "http://localhost:8000/api"
        }/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        // console.log("Fetched notifications:", data.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark single notification as read
  const markAsRead = async (id) => {
    try {
      await fetch(
        `${
          API_BASE_URL ? API_BASE_URL : "http://localhost:8000/api"
        }/notifications/${id}/read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date() } : n))
      );
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await fetch(
        `${
          API_BASE_URL ? API_BASE_URL : "http://localhost:8000/api"
        }/notifications/read-all`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: new Date() }))
      );
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  //   if (loading) {
  //     return <p className="p-6">Loading notifications...</p>;
  //   }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSideBar />

      <div className="md:ml-64">
        <DashboardHeader PageTitle="Notifications" />
        <div className="p-6 max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-900">Notifications</h2>

            {notifications.some((n) => !n.read_at) && (
              <button
                onClick={markAllAsRead}
                className="text-sm bg-green-900 text-white px-4 py-2 rounded hover:bg-green-800"
              >
                Mark all as read
              </button>
            )}
          </div>
          {loading && <p className="text-gray-600">Loading notifications...</p>}
          {notifications.length === 0 ? (
            <p className="text-gray-600">No notifications available.</p>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border rounded p-4 flex justify-between items-start ${
                    notification.read_at === null
                      ? "bg-white"
                      : "bg-green-50 border-green-300"
                  }`}
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {notification.data.action?.toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-700">
                      {notification.data.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      IP: {notification.data.ip_address} •{" "}
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>

                  {!notification.read_at && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-green-900 hover:text-green-700"
                      title="Mark as read"
                    >
                      <CheckCircleIcon className="h-6 w-6" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

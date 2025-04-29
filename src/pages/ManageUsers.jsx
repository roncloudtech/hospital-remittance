import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import DashboardSideBar from "../components/DashboardSideBar";
import DashboardHeader from "../components/DashboardHeader";

const ManageUsers = () => {
  // Base API URL
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const { authToken, user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/unauthorized");
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL ? API_BASE_URL : 'http://localhost:8000'}/api/getusers`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [authToken, navigate, user, API_BASE_URL]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSideBar />
      <div className="md:ml-64 p-6">
        <DashboardHeader PageTitle="Manage Users" />

        <div className="max-w-7xl mx-auto">
          {/* Add User Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100 mb-6">
            <h2 className="text-lg font-medium text-green-900 mb-4">
              Add New User
            </h2>
            <Link
              to="/register"
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                loading ? "bg-gray-400" : "bg-green-900 hover:bg-green-800"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400`}
            >
              Add User
            </Link>
          </div>

          {/* Users List */}
          <div className="bg-white rounded-lg shadow-sm border border-green-100">
            <div className="p-6">
              <h2 className="text-lg font-medium text-green-900 mb-4">
                Registered Users
              </h2>

              {loading ? (
                <p className="text-gray-600">Loading users...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-green-900 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-green-900 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-green-900 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-green-900 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.firstname} {user.lastname}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-yellow-600 hover:text-yellow-900 mr-4">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
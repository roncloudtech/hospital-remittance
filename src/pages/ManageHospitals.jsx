import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import DashboardSideBar from "../components/DashboardSideBar";
import DashboardHeader from "../components/DashboardHeader";

const ManageHospitals = () => {
  const { authToken, user } = useAuth();
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
//   const [hospitalName, setHospitalName] = useState("");
//   const [hospitalLocation, setHospitalLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Redirect if not admin
    if (user?.role !== "admin") {
      navigate("/unauthorized");
      return;
    }

    const fetchHospitals = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8000/api/gethospitals",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setHospitals(response.data);
      } catch (err) {
        setError("Failed to fetch hospitals");
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [authToken, navigate, user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSideBar />
      <div className="md:ml-64 p-6">
        <DashboardHeader PageTitle="Manage Hospitals"/>

        <div className="max-w-7xl mx-auto">
          {/* Add Hospital Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100 mb-6">
            <h2 className="text-lg font-medium text-green-900 mb-4">
              Add New Hospital
            </h2>
              <Link to="/add-hospital" className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                  loading ? "bg-gray-400" : "bg-green-900 hover:bg-green-800"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400`}>Add Hospital</Link>
          </div>

          {/* Hospitals List */}
          <div className="bg-white rounded-lg shadow-sm border border-green-100">
            <div className="p-6">
              <h2 className="text-lg font-medium text-green-900 mb-4">
                Registered Military Hospitals
              </h2>

              {loading ? (
                <p className="text-gray-600">Loading hospitals...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-green-900 uppercase tracking-wider">
                          Hospital Name
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-green-900 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-green-900 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {hospitals.map((hospital) => (
                        <tr key={hospital.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {hospital.hospital_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {hospital.address}
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

export default ManageHospitals;

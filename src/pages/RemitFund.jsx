import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import DashboardSideBar from "../components/DashboardSideBar";
import DashboardHeader from "../components/DashboardHeader";

const RemitFund = () => {
  const { authToken, user } = useAuth();
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [formData, setFormData] = useState({
    hospital_id: "",
    amount: "",
    description: "",
    transaction_date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user?.role !== "remitter") {
      navigate("/unauthorized");
    }

    // const fetchHospitals = async () => {
    //   try {
    //     const response = await axios.post(
    //       "http://localhost:8000/api/fetchremitterhospitals",
    //       {
    //         hospital_remitter: user?.id
    //       },
    //       {
    //         headers: {
    //           Authorization: `Bearer ${authToken}`,
    //         },
    //       }
    //     );
    //     console.log(response.data)
    //     setHospitals(response.data);
    //   } catch (error) {
    //     console.error("Error fetching hospitals:", error);
    //   }
    // };

    const fetchHospitals = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/my-hospitals",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.data.success) {
          setHospitals(response.data.hospitals);
        } else {
          console.error("API Error:", response.data.message);
        }
      } catch (error) {
        console.error(
          "Request Failed:",
          error.response?.data?.message || error.message
        );
      }
    };
    fetchHospitals();
  }, [authToken, navigate, user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.hospital_id) {
      newErrors.hospital_id = "Hospital selection is required";
    }

    if (
      !formData.amount ||
      isNaN(formData.amount) ||
      parseFloat(formData.amount) <= 0
    ) {
      newErrors.amount = "Valid amount is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:8000/api/remittances",
        {
          ...formData,
          amount: parseFloat(formData.amount),
          remitter_id: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      navigate("/transactions");
    } catch (error) {
      setErrors(
        error.response?.data?.errors || { general: "Submission failed" }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSideBar />

      <div className="md:ml-64">
        <DashboardHeader PageTitle="Remit Funds" />

        <main className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-green-100 p-6">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 max-w-3xl mx-auto"
            >
              {errors.general && (
                <div className="text-red-500 text-center mb-4">
                  {errors.general}
                </div>
              )}

              {/* Hospital Selection */}
              <div>
                <label className="block text-sm font-medium text-green-900 mb-1">
                  Select Hospital
                </label>

                {loading ? (
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <select
                      name="hospital_id"
                      value={formData.hospital_id}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.hospital_id
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:ring-yellow-400 focus:border-yellow-400`}
                      disabled={hospitals.length === 0}
                    >
                      <option value="">Select Hospital</option>
                      {hospitals.map((hospital) => (
                        <option key={hospital.id} value={hospital.id}>
                          {hospital.hospital_name} ({hospital.hospital_id})
                        </option>
                      ))}
                    </select>

                    {!loading && hospitals.length === 0 && (
                      <p className="text-gray-500 text-sm mt-2">
                        No hospitals assigned to your account
                      </p>
                    )}
                  </>
                )}

                {errors.hospital_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.hospital_id}
                  </p>
                )}
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-green-900 mb-1">
                  Select Hospital
                </label>
                <select
                  name="hospital_id"
                  value={formData.hospital_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.hospital_id ? "border-red-500" : "border-gray-300"
                  } focus:ring-yellow-400 focus:border-yellow-400`}
                >
                  <option value="">Select Hospital</option>
                  {hospitals.map((hospital) => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.hospital_name} ({hospital.hospital_id})
                    </option>
                  ))}
                </select>
                {errors.hospital_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.hospital_id}
                  </p>
                )}
              </div> */}

              {/* Amount and Date Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">
                    Amount (₦)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.amount ? "border-red-500" : "border-gray-300"
                    } focus:ring-yellow-400 focus:border-yellow-400`}
                    placeholder="Enter amount"
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">
                    Transaction Date
                  </label>
                  <input
                    type="date"
                    name="transaction_date"
                    value={formData.transaction_date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-400 focus:border-yellow-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-green-900 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-400 focus:border-yellow-400"
                  rows="3"
                  placeholder="Optional transaction description"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white ${
                  loading ? "bg-gray-400" : "bg-green-900 hover:bg-green-800"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400`}
              >
                {loading ? "Processing Remittance..." : "Submit Remittance"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RemitFund;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import DashboardSideBar from "../components/DashboardSideBar";
import DashboardHeader from "../components/DashboardHeader";
import PaystackButton from "../components/PaystackButton";

const RemitFund = () => {
  // Base API URL
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const { authToken, user } = useAuth();
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const uniqueRef = `PAYSTACK_${Date.now()}`;
  const [formData, setFormData] = useState({
    hospital_id: "",
    amount: "",
    description: "",
    payment_method: "",
    ref: uniqueRef, // "ref_" + Math.floor(Math.random() * 1000000000 + 1),
    transaction_date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user?.role !== "remitter") {
      navigate("/unauthorized");
    }

    const fetchHospitals = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL ? API_BASE_URL : 'http://localhost:8000/api'}/my-hospitals`,
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
  }, [authToken, navigate, user, API_BASE_URL]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.hospital_id) {
      newErrors.hospital_id = "Hospital selection is required";
    }

    if (!formData.payment_method) {
      newErrors.payment_method = "Payment method selection is required";
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Merged: Handle Paystack Success
  const [paystackSubmitted, setPaystackSubmitted] = useState(false);

  const handlePaystackSuccess = async (response) => {
    if (paystackSubmitted) return;
    setPaystackSubmitted(true);

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL ? API_BASE_URL : 'http://localhost:8000/api'}/remittances`,
        {
          ...formData,
          amount: parseFloat(formData.amount),
          remitter_id: user.id,
          payment_status: "success",
          payment_reference: response.reference,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (res.data.success) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      setErrors({
        general: error.response?.data?.message || "Payment verification failed",
      });
      setPaystackSubmitted(false); // allow retry
    } finally {
      setLoading(false);
    }
  };

  // Bank Deposit Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if(formData.payment_method === "Paystack") {
      return;
    } else {
        setLoading(true);
        try {
          const payload = {
            ...formData,
            amount: parseFloat(formData.amount),
            remitter_id: user.id,
            payment_status: "pending",
            // payment_reference: uniqueRef, //`BANK-${Date.now()}`,
            payment_reference: `BANK-${Date.now()}`,
          };
    
          await axios.post(`${API_BASE_URL ? API_BASE_URL : 'http://localhost:8000/api'}/remittances`, payload, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
    
          navigate("/dashboard");
        } catch (error) {
          setErrors(
            error.response?.data?.errors || { general: "Submission failed" }
          );
        } finally {
          setLoading(false);
        }
      };
    }


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

              {/* Hospital and Payment Method Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
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
                    disabled={hospitals.length === 0}
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">
                    Select Payment Method
                  </label>
                  <select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.payment_method
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:ring-yellow-400 focus:border-yellow-400`}
                  >
                    <option value="">Select Payment</option>
                    <option value="Paystack">Paystack</option>
                    <option value="Bank Deposit">Bank Deposit</option>
                  </select>
                  {errors.payment_method && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.payment_method}
                    </p>
                  )}
                </div>
              </div>

              {/* Amount and Date */}
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

              {/* Submit or Paystack Button */}
              {formData.payment_method === "Paystack" ? (
                <PaystackButton
                  amt={formData.amount}
                  hospital={formData.hospital_id}
                  email={user?.email}
                  onSuccess={handlePaystackSuccess}
                  onClose={() => setLoading(false)}
                  refCode={formData.ref}
                />
              ) : (
                <button
                  type="submit"
                  // onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white ${
                    loading ? "bg-gray-400" : "bg-green-900 hover:bg-green-800"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400`}
                >
                  {loading ? "Processing Remittance..." : "Submit Remittance"}
                </button>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RemitFund;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import DashboardSideBar from "../components/DashboardSideBar";
import DashboardHeader from "../components/DashboardHeader";

const OpenTicket = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const { authToken } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    evidence: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Valid file types
  const validFileTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file && !validFileTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, evidence: "Only JPG, PNG, or PDF files are allowed" }));
        setFormData((prev) => ({ ...prev, evidence: null }));
      } else {
        setErrors((prev) => ({ ...prev, evidence: null }));
        setFormData((prev) => ({ ...prev, evidence: file || null }));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.message) newErrors.message = "Message is required";
    // Note: Evidence file validation handled onChange
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("subject", formData.subject);
    formDataToSubmit.append("message", formData.message);
    if (formData.evidence) {
      formDataToSubmit.append("evidence", formData.evidence);
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL || "http://localhost:8000/api"}/tickets`,
        formDataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert(response.data.message);
        navigate("/remitter-reports");
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
      setErrors({
        general: error.response?.data?.errors || "Failed to submit ticket. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSideBar />
      <div className="md:ml-64">
        <DashboardHeader PageTitle="Open Ticket" />
        <main className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-green-100 p-6">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
              {errors.general && (
                <div className="text-red-500 text-center mb-4">
                  {errors.general}
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-green-900 mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.subject ? "border-red-500" : "border-gray-300"
                  } focus:ring-yellow-400 focus:border-yellow-400`}
                  placeholder="Enter ticket subject"
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-green-900 mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  } focus:ring-yellow-400 focus:border-yellow-400`}
                  rows="4"
                  placeholder="Describe the issue"
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              {/* Evidence */}
              <div>
                <label className="block text-sm font-medium text-green-900 mb-1">
                  Evidence (Optional)
                </label>
                <input
                  type="file"
                  name="evidence"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:ring-yellow-400 focus:border-yellow-400"
                />
                {errors.evidence && <p className="text-red-500 text-sm mt-1">{errors.evidence}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white ${
                  loading ? "bg-gray-400" : "bg-green-900 hover:bg-green-800"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400`}
              >
                {loading ? "Submitting..." : "Submit Ticket"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OpenTicket;

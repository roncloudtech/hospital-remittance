import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import DashboardSideBar from '../components/DashboardSideBar';
import DashboardHeader from '../components/DashboardHeader';

const AddHospital = () => {
  // Base API URL
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const { authToken, user } = useAuth();
  const navigate = useNavigate();
  const [remitters, setRemitters] = useState([]);
  const [formData, setFormData] = useState({
    hospital_id: '',
    hospital_name: '',
    military_division: '',
    address: '',
    phone_number: '',
    hospital_remitter: '',
    monthly_remittance_target: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/unauthorized');
    }

    const fetchRemitters = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL ? API_BASE_URL : 'http://localhost:8000/api'}/getusers`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        setRemitters(response.data);
      } catch (error) {
        console.error('Error fetching remitters:', error);
      }
    };

    fetchRemitters();
  }, [authToken, navigate, user, API_BASE_URL]);

  const validateForm = () => {
    const newErrors = {};
    const idPattern = /^[A-Z]{3}-\d{6}$/;
    
    // Hospital ID validation
    if (!formData.hospital_id.match(idPattern)) {
      newErrors.hospital_id = 'Invalid ID format (XXX-123456)';
    }
    
    // Required field validations
    if (!formData.hospital_name.trim()) {
      newErrors.hospital_name = 'Hospital name is required';
    }
    if (!formData.military_division.trim()) {
      newErrors.military_division = 'Formation is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    // Phone number validation
    if (!/^\+234\d{10}$|^0\d{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Invalid Nigerian phone format (+234...)';
    }
    // Remitter validation (keep original field name)
    if (!formData.hospital_remitter) {
      newErrors.hospital_remitter = 'Remitter is required';
    }
    // Monthly Remittance Target validation (keep original field name)
    if (!formData.monthly_remittance_target) {
      newErrors.monthly_remittance_target = 'Monthly Remittance Target is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Keep original API endpoint that matches Laravel route
      const response = await axios.post(`${API_BASE_URL ? API_BASE_URL : 'http://localhost:8000/api'}/addhospital`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json" // Add content-type header
        }
      });

      console.log(response);
      navigate('/manage-hospitals');
    } catch (error) {
      console.log(error);
      // Enhanced error handling
      if (error.response?.data?.errors) {
        setErrors({ 
          ...error.response.data.errors,
          general: 'Please fix the highlighted errors' 
        });
      } else {
        setErrors({ general: 'Submission failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSideBar />
      
      <div className="md:ml-64">
        <DashboardHeader PageTitle="Register Military Hospital" />
        
        <main className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-green-100 p-6">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
              {errors.general && (
                <div className="text-red-500 text-center mb-4">{errors.general}</div>
              )}

              {/* Hospital ID Field */}
              <div>
                <label className="block text-sm font-medium text-green-900 mb-1">
                  Hospital ID (XXX-123456)
                </label>
                <input
                  name="hospital_id"
                  value={formData.hospital_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.hospital_id ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-yellow-400 focus:border-yellow-400`}
                  placeholder="ABC-123456"
                />
                {errors.hospital_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.hospital_id}</p>
                )}
              </div>

              {/* Hospital Name Field */}
              <div>
                <label className="block text-sm font-medium text-green-900 mb-1">
                  Hospital Name
                </label>
                <input
                  name="hospital_name"
                  value={formData.hospital_name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.hospital_name ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-yellow-400 focus:border-yellow-400`}
                />
                {errors.hospital_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.hospital_name}</p>
                )}
              </div>

              {/* Military Division and Phone Number Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">
                    Formation
                  </label>
                  <input
                    name="military_division"
                    value={formData.military_division}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.military_division ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-yellow-400 focus:border-yellow-400`}
                  />
                  {errors.military_division && (
                    <p className="text-red-500 text-sm mt-1">{errors.military_division}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">
                    Phone Number (+234...)
                  </label>
                  <input
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.phone_number ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-yellow-400 focus:border-yellow-400`}
                  />
                  {errors.phone_number && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
                  )}
                </div>
              </div>

              {/* Address Field */}
              <div>
                <label className="block text-sm font-medium text-green-900 mb-1">
                  Full Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-yellow-400 focus:border-yellow-400`}
                  rows="3"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              {/* Remitter Selection Field & Monthly Remittance Target */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Remitter Selection Field */}
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">
                    Assign Remitter
                  </label>
                  <select
                    name="hospital_remitter" // Match backend field name
                    value={formData.hospital_remitter}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.hospital_remitter ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-yellow-400 focus:border-yellow-400`}
                  >
                    <option value="">Select Remitter</option>
                    {remitters.map(remitter => (
                      <option key={remitter.id} value={remitter.id}>
                      {remitter.role} |{remitter.firstname} {remitter.lastname} | {remitter.phone_number}
                      </option>
                    ))}
                  </select>
                  {errors.hospital_remitter && (
                    <p className="text-red-500 text-sm mt-1">{errors.hospital_remitter}</p>
                  )}
                </div>

                {/* Monthly Remittance Target */}
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">
                    Monthly Remittance Target
                  </label>
                  <input
                    name="monthly_remittance_target"
                    value={formData.monthly_remittance_target}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.monthly_remittance_target ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-yellow-400 focus:border-yellow-400`}
                  />
                  {errors.monthly_remittance_target && (
                    <p className="text-red-500 text-sm mt-1">{errors.monthly_remittance_target}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white ${
                  loading ? 'bg-gray-400' : 'bg-green-900 hover:bg-green-800'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400`}
              >
                {loading ? 'Registering Hospital...' : 'Register Military Hospital'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddHospital;
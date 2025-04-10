import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import DashboardSideBar from '../components/DashboardSideBar';
import DashboardHeader from '../components/DashboardHeader';

const AddHospital = () => {
  const { authToken, user } = useAuth();
  const navigate = useNavigate();
  const [remitters, setRemitters] = useState([]);
  const [formData, setFormData] = useState({
    hospital_id: '',
    hospital_name: '',
    hospital_formation: '',
    address: '',
    phone_number: '',
    hospital_remitter: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/unauthorized');
    }

    const fetchRemitters = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/getusers', {
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
  }, [authToken, navigate, user]);

  const validateForm = () => {
    const newErrors = {};
    const idPattern = /^[A-Z]{3}-\d{6}$/;
    
    if (!formData.hospital_id.match(idPattern)) {
      newErrors.hospital_id = 'Invalid ID format (XXX-123456)';
    }
    if (!formData.hospital_name.trim()) {
      newErrors.hospital_name = 'Hospital name is required';
    }
    if (!formData.hospital_formation.trim()) {
      newErrors.hospital_formation = 'Formation is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!/^\+234\d{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Invalid Nigerian phone format (+234...)';
    }
    if (!formData.hospital_remitter) {
      newErrors.hospital_remitter = 'Remitter is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/addhospital', formData, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      navigate('/manage-hospitals');
    } catch (error) {
      setErrors(error.response?.data?.errors || { general: 'Submission failed' });
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

              {/* Hospital ID */}
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

              {/* Hospital Name */}
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

              {/* Formation and Phone Number Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">
                    Military Formation
                  </label>
                  <input
                    name="hospital_formation"
                    value={formData.hospital_formation}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.hospital_formation ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-yellow-400 focus:border-yellow-400`}
                  />
                  {errors.hospital_formation && (
                    <p className="text-red-500 text-sm mt-1">{errors.hospital_formation}</p>
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

              {/* Address */}
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

              {/* Remitter Selection */}
              <div>
                <label className="block text-sm font-medium text-green-900 mb-1">
                  Assign Remitter
                </label>
                <select
                  name="hospital_remitter"
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
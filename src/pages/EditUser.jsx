import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardSideBar from '../components/DashboardSideBar';
import DashboardHeader from '../components/DashboardHeader';

const EditUser = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
  const { authToken, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/unauthorized');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });

        const u = res.data.user;
        setFormData({
          first_name: u.firstname || '',
          last_name: u.lastname || '',
          email: u.email || '',
          phone_number: u.phone_number || '',
          role: u.role || 'remitter'
        });
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchUser();
  }, [authToken, id, navigate, user, API_BASE_URL]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.role) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/users/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      navigate('/manage-users');
    } catch (error) {
      console.error(error);
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
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isFetching || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-700">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSideBar />
      <div className="md:ml-64">
        <DashboardHeader PageTitle="Edit User" />
        <main className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-green-100 p-6">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
              {errors.general && (
                <div className="text-red-500 text-center mb-4">
                  {errors.general}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-green-900 mb-1">First Name</label>
                <input
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.first_name ? "border-red-500" : "border-gray-300"} focus:ring-yellow-400 focus:border-yellow-400`}
                />
                {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-green-900 mb-1">Last Name</label>
                <input
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.last_name ? "border-red-500" : "border-gray-300"} focus:ring-yellow-400 focus:border-yellow-400`}
                />
                {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-green-900 mb-1">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"} focus:ring-yellow-400 focus:border-yellow-400`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-green-900 mb-1">Phone Number</label>
                <input
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.phone_number ? "border-red-500" : "border-gray-300"} focus:ring-yellow-400 focus:border-yellow-400`}
                />
                {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-green-900 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.role ? "border-red-500" : "border-gray-300"} focus:ring-yellow-400 focus:border-yellow-400`}
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="remitter">Remitter</option>
                </select>
                {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white ${loading ? "bg-gray-400" : "bg-green-900 hover:bg-green-800"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400`}
              >
                {loading ? "Updating User..." : "Update User"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditUser;
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import DashboardSideBar from "../components/DashboardSideBar";
import DashboardHeader from "../components/DashboardHeader";
// import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (
      formData.phoneNumber &&
      !/^\+234[789][01]\d{8}$|^0[789][01]\d{8}$/.test(formData.phoneNumber)
    ) {
      newErrors.phoneNumber = "Invalid phone number format";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/register", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phoneNumber || null,
        password: formData.password,
        role: formData.role,
      });

      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Registration error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSideBar />
      <div className="md:ml-64 p-6">
        <DashboardHeader PageTitle="Register New User" />

        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
            <h2 className="text-lg font-medium text-green-900 mb-6">
              Create New Military Healthcare Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name Input */}
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-2">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-yellow-400 focus:border-transparent`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name Input */}
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-2">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-yellow-400 focus:border-transparent`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                {/* Role Select */}
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errors.role ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-yellow-400 focus:border-transparent`}
                  >
                    <option value="">Select Role</option>
                    <option value="remitter">Remitter</option>
                    <option value="admin">Admin</option>
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-500">{errors.role}</p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-2">
                    Military Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-yellow-400 focus:border-transparent`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Phone Number Input */}
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+2348000000000"
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errors.phoneNumber ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-yellow-400 focus:border-transparent`}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-2">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-yellow-400 focus:border-transparent`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg font-medium ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-900 hover:bg-green-800"
                  } text-white transition-colors`}
                >
                  {loading
                    ? "Creating Account..."
                    : "Register Military Account"}
                </button>
              </div>

              <div className="text-center text-sm mt-4">
                <p className="text-green-900">
                  Already registered?{" "}
                  <Link
                    to="/login"
                    className="font-semibold hover:text-yellow-400 transition-colors"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

// import React, { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import DashboardSideBar from "../components/DashboardSideBar";
// import DashboardHeader from "../components/DashboardHeader";
// import { useAuth } from "../context/AuthContext";

// const Register = () => {
//   const { authToken, user } = useAuth();
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phoneNumber: "",
//     password: "",
//     role: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.firstName.trim())
//       newErrors.firstName = "First name is required";
//     if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Invalid email address";
//     }
//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters";
//     }
//     if (
//       formData.phoneNumber &&
//       !/^\+234[789][01]\d{8}$|^0[789][01]\d{8}$/.test(formData.phoneNumber)
//       // formData.phoneNumber &&
//       // !/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber)
//     ) {
//       newErrors.phoneNumber = "Invalid phone number format";
//     }

//     // Add role validation
//     if (!formData.role) {
//       newErrors.role = "Role is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const response = await axios.post("http://localhost:8000/api/register", {
//         first_name: formData.firstName,
//         last_name: formData.lastName,
//         email: formData.email,
//         phone_number: formData.phoneNumber || null,
//         password: formData.password,
//         role: formData.role,
//       });

//       if (response.status === 201) {
//         navigate("/login");
//       }
//     } catch (error) {
//       if (error.response?.data?.errors) {
//         setErrors(error.response.data.errors);
//       } else {
//         console.error("Registration error:", error);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <DashboardSideBar />
//       <div className="md:ml-64 p-6">
//         <DashboardHeader PageTitle="Register New User" />

//         <div className="max-w-7xl mx-auto">
//           <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
//             <h2 className="text-lg font-medium text-green-900 mb-6">
//               Create New Military Healthcare Account
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* First Name Input */}
//                 <div>
//                   <label className="block text-sm font-medium text-green-900 mb-2">
//                     First Name
//                   </label>
//                   <input
//                     name="firstName"
//                     type="text"
//                     value={formData.firstName}
//                     onChange={handleChange}
//                     className={`w-full px-4 py-2 border rounded-lg ${
//                       errors.firstName ? "border-red-500" : "border-gray-300"
//                     } focus:ring-2 focus:ring-yellow-400 focus:border-transparent`}
//                   />
//                   {errors.firstName && (
//                     <p className="mt-1 text-sm text-red-500">
//                       {errors.firstName}
//                     </p>
//                   )}
//                 </div>

//                 {/* Last Name Input */}
//                 <div>
//                   <label className="block text-sm font-medium text-green-900 mb-2">
//                     Last Name
//                   </label>
//                   <input
//                     name="lastName"
//                     type="text"
//                     value={formData.lastName}
//                     onChange={handleChange}
//                     className={`w-full px-4 py-2 border rounded-lg ${
//                       errors.lastName ? "border-red-500" : "border-gray-300"
//                     } focus:ring-2 focus:ring-yellow-400 focus:border-transparent`}
//                   />
//                   {errors.lastName && (
//                     <p className="mt-1 text-sm text-red-500">
//                       {errors.lastName}
//                     </p>
//                   )}
//                 </div>

//                 {/* Role Select */}
//                 <div>
//                   <label className="block text-sm font-medium text-green-900 mb-2">
//                     Role
//                   </label>
//                   <select
//                     name="role"
//                     value={formData.role}
//                     onChange={handleChange}
//                     className={`w-full px-4 py-2 border rounded-lg ${
//                       errors.role ? "border-red-500" : "border-gray-300"
//                     } focus:ring-2 focus:ring-yellow-400 focus:border-transparent`}
//                   >
//                     <option value="">Select Role</option>
//                     <option value="remitter">Remitter</option>
//                     <option value="admin">Admin</option>
//                   </select>
//                   {errors.role && (
//                     <p className="mt-1 text-sm text-red-500">{errors.role}</p>
//                   )}
//                 </div>

//                 {/* Email Input */}
//                 <div>
//                   <label className="block text-sm font-medium text-green-900 mb-2">
//                     Military Email
//                   </label>
//                   <input
//                     name="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className={`w-full px-4 py-2 border rounded-lg ${
//                       errors.email ? "border-red-500" : "border-gray-300"
//                     } focus:ring-2 focus:ring-yellow-400 focus:border-transparent`}
//                   />
//                   {errors.email && (
//                     <p className="mt-1 text-sm text-red-500">{errors.email}</p>
//                   )}
//                 </div>

//                 {/* Phone Number Input */}
//                 <div>
//                   <label className="block text-sm font-medium text-green-900 mb-2">
//                     Phone Number
//                   </label>
//                   <input
//                     name="phoneNumber"
//                     type="tel"
//                     value={formData.phoneNumber}
//                     onChange={handleChange}
//                     placeholder="+2348000000000"
//                     className={`w-full px-4 py-2 border rounded-lg ${
//                       errors.phoneNumber ? "border-red-500" : "border-gray-300"
//                     } focus:ring-2 focus:ring-yellow-400 focus:border-transparent`}
//                   />
//                   {errors.phoneNumber && (
//                     <p className="mt-1 text-sm text-red-500">
//                       {errors.phoneNumber}
//                     </p>
//                   )}
//                 </div>

//                 {/* Password Input */}
//                 <div>
//                   <label className="block text-sm font-medium text-green-900 mb-2">
//                     Password
//                   </label>
//                   <input
//                     name="password"
//                     type="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className={`w-full px-4 py-2 border rounded-lg ${
//                       errors.password ? "border-red-500" : "border-gray-300"
//                     } focus:ring-2 focus:ring-yellow-400 focus:border-transparent`}
//                   />
//                   {errors.password && (
//                     <p className="mt-1 text-sm text-red-500">
//                       {errors.password}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="mt-8">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`w-full py-3 px-4 rounded-lg font-medium ${
//                     loading
//                       ? "bg-gray-400 cursor-not-allowed"
//                       : "bg-green-900 hover:bg-green-800"
//                   } text-white transition-colors`}
//                 >
//                   {loading
//                     ? "Creating Account..."
//                     : "Register Military Account"}
//                 </button>
//               </div>

//               <div className="text-center text-sm mt-4">
//                 <p className="text-green-900">
//                   Already registered?{" "}
//                   <Link
//                     to="/login"
//                     className="font-semibold hover:text-yellow-400 transition-colors"
//                   >
//                     Login here
//                   </Link>
//                 </p>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;

// import React, { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import Header from "../components/Header";
// import Footer from "../components/Footer";

// const Register = () => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phoneNumber: "",
//     password: "",
//     role: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.firstName.trim())
//       newErrors.firstName = "First name is required";
//     if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Invalid email address";
//     }
//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters";
//     }
//     if (
//       formData.phoneNumber &&
//       !/^\+234[789][01]\d{8}$|^0[789][01]\d{8}$/.test(formData.phoneNumber)
//       // formData.phoneNumber &&
//       // !/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber)
//     ) {
//       newErrors.phoneNumber = "Invalid phone number format";
//     }

//     // Add role validation
//     if (!formData.role) {
//       newErrors.role = "Role is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const response = await axios.post("http://localhost:8000/api/register", {
//         first_name: formData.firstName,
//         last_name: formData.lastName,
//         email: formData.email,
//         phone_number: formData.phoneNumber || null,
//         password: formData.password,
//         role: formData.role,
//       });

//       if (response.status === 201) {
//         navigate("/login");
//       }
//     } catch (error) {
//       if (error.response?.data?.errors) {
//         setErrors(error.response.data.errors);
//       } else {
//         console.error("Registration error:", error);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//         <div className="sm:mx-auto sm:w-full sm:max-w-md">
//           <h2 className="mt-6 text-center text-3xl font-bold text-green-900">
//             Defence Health Services Registration
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Create your account to manage military healthcare funds
//           </p>
//         </div>

//         <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//           <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 gap-6">
//                 <div>
//                   <label
//                     htmlFor="firstName"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     First Name
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="firstName"
//                       name="firstName"
//                       type="text"
//                       value={formData.firstName}
//                       onChange={handleChange}
//                       className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
//                         errors.firstName
//                           ? "border-red-500 focus:ring-red-500"
//                           : "border-gray-300 focus:ring-yellow-400"
//                       }`}
//                     />
//                     {errors.firstName && (
//                       <p className="mt-2 text-sm text-red-500">
//                         {errors.firstName}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="lastName"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Last Name
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="lastName"
//                       name="lastName"
//                       type="text"
//                       value={formData.lastName}
//                       onChange={handleChange}
//                       className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
//                         errors.lastName
//                           ? "border-red-500 focus:ring-red-500"
//                           : "border-gray-300 focus:ring-yellow-400"
//                       }`}
//                     />
//                     {errors.lastName && (
//                       <p className="mt-2 text-sm text-red-500">
//                         {errors.lastName}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label
//                   htmlFor="role"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Role
//                 </label>
//                 <div className="mt-1">
//                   <select
//                     id="role"
//                     name="role"
//                     value={formData.role}
//                     onChange={handleChange}
//                     className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
//                       errors.role
//                         ? "border-red-500 focus:ring-red-500"
//                         : "border-gray-300 focus:ring-yellow-400"
//                     }`}
//                   >
//                     <option value="">Select Role</option>
//                     <option value="remitter">Remitter</option>
//                     <option value="admin">Admin</option>
//                   </select>
//                   {errors.role && (
//                     <p className="mt-2 text-sm text-red-500">{errors.role}</p>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Military Email
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
//                       errors.email
//                         ? "border-red-500 focus:ring-red-500"
//                         : "border-gray-300 focus:ring-yellow-400"
//                     }`}
//                   />
//                   {errors.email && (
//                     <p className="mt-2 text-sm text-red-500">{errors.email}</p>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <label
//                   htmlFor="phoneNumber"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Phone Number (with country code)
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="phoneNumber"
//                     name="phoneNumber"
//                     type="tel"
//                     value={formData.phoneNumber}
//                     onChange={handleChange}
//                     placeholder="+2348000000000"
//                     className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
//                       errors.phoneNumber
//                         ? "border-red-500 focus:ring-red-500"
//                         : "border-gray-300 focus:ring-yellow-400"
//                     }`}
//                   />
//                   {errors.phoneNumber && (
//                     <p className="mt-2 text-sm text-red-500">
//                       {errors.phoneNumber}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Password
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="password"
//                     name="password"
//                     type="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
//                       errors.password
//                         ? "border-red-500 focus:ring-red-500"
//                         : "border-gray-300 focus:ring-yellow-400"
//                     }`}
//                   />
//                   {errors.password && (
//                     <p className="mt-2 text-sm text-red-500">
//                       {errors.password}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
//                     loading ? "bg-gray-400" : "bg-green-900 hover:bg-green-800"
//                   } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400`}
//                 >
//                   {loading ? "Registering..." : "Create Military Account"}
//                 </button>
//               </div>

//               <div className="text-center text-sm">
//                 <p className="text-gray-600">
//                   Already have an account?{" "}
//                   <Link
//                     to="/login"
//                     className="font-medium text-green-900 hover:text-yellow-400"
//                   >
//                     Login here
//                   </Link>
//                 </p>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default Register;

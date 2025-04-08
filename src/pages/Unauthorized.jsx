// src/pages/Unauthorized.jsx
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
      <p className="text-lg text-gray-600 mb-8">
        You don't have permission to access this page
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-green-900 text-white rounded-md hover:bg-green-800"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default Unauthorized;
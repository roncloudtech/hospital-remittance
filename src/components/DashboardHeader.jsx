import React, { useEffect } from 'react';
// import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext'; // Import the auth context
import { useNavigate } from 'react-router-dom';
import useIdleTimer from '../hooks/useIdleTimer';

export default function DashboardHeader({PageTitle}) {
    // useIdleTimer();
    const navigate = useNavigate();
    const { user } = useAuth(); // Get user from context

    // Check authentication status
    useEffect(() => {
    const token = localStorage.getItem('military_token');
    if (!token) {
        navigate('/login');
    }
    }, [navigate]);
  return (
    <>
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-green-900">{PageTitle || "Dashbord Title"}</h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user?.role === 'admin' ? 'Admin' : 'Remitter'} {user?.firstname} {user?.lastname}
              </p>
            </div>
            <div className="flex items-center">
              {/* <UserCircleIcon className="h-8 w-8 text-green-900 mr-2" /> */}
              <div>
                <p className="text-sm font-medium">
                  {user?.firstname} {user?.lastname}
                </p>
                <p className="text-xs text-gray-600">Role: {user?.role}</p>
              </div>
            </div>
          </div>
        </header>
    </>
  )
}

import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChartBarIcon, CurrencyDollarIcon, DocumentTextIcon, ShieldCheckIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('military_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 bg-green-900 w-64 shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-yellow-400">
            Defence Health Portal
          </h2>
          <p className="text-gray-300 text-sm mt-2">Capitation Fund Management</p>
        </div>
        
        <nav className="mt-8">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `flex items-center px-6 py-3 text-sm font-medium ${
              isActive ? 'bg-green-800 text-yellow-400' : 'text-gray-300 hover:bg-green-800'
            }`}
          >
            <ChartBarIcon className="h-5 w-5 mr-3" />
            Overview
          </NavLink>
          <NavLink 
            to="/funds" 
            className={({ isActive }) => `flex items-center px-6 py-3 text-sm font-medium ${
              isActive ? 'bg-green-800 text-yellow-400' : 'text-gray-300 hover:bg-green-800'
            }`}
          >
            <CurrencyDollarIcon className="h-5 w-5 mr-3" />
            Fund Allocation
          </NavLink>
          <NavLink 
            to="/transactions" 
            className={({ isActive }) => `flex items-center px-6 py-3 text-sm font-medium ${
              isActive ? 'bg-green-800 text-yellow-400' : 'text-gray-300 hover:bg-green-800'
            }`}
          >
            <DocumentTextIcon className="h-5 w-5 mr-3" />
            Transactions
          </NavLink>
          <NavLink 
            to="/reports" 
            className={({ isActive }) => `flex items-center px-6 py-3 text-sm font-medium ${
              isActive ? 'bg-green-800 text-yellow-400' : 'text-gray-300 hover:bg-green-800'
            }`}
          >
            <ShieldCheckIcon className="h-5 w-5 mr-3" />
            Reports
          </NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <div>
              <h1 className="text-xl font-bold text-green-900">Capitation Fund Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, Commander</p>
            </div>
            <div className="flex items-center">
              <UserCircleIcon className="h-8 w-8 text-green-900 mr-2" />
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-600">Military ID: NG-2345</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Summary Cards */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-medium text-green-900">Total Funds</h3>
              <p className="text-2xl font-bold mt-2">₦250,000,000</p>
              <span className="text-sm text-green-600">+2.5% from last month</span>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-medium text-green-900">Recent Transactions</h3>
              <p className="text-2xl font-bold mt-2">₦15,200,000</p>
              <span className="text-sm text-green-600">Last 7 days</span>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-medium text-green-900">Pending Approvals</h3>
              <p className="text-2xl font-bold mt-2">3 Requests</p>
              <span className="text-sm text-green-600">2 Urgent</span>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-medium text-green-900 mb-4">Monthly Fund Utilization</h3>
              {/* Add Chart component here */}
              <div className="h-64 bg-gray-50 rounded-md"></div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-medium text-green-900 mb-4">Expenditure Trends</h3>
              {/* Add Chart component here */}
              <div className="h-64 bg-gray-50 rounded-md"></div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-green-100">
            <div className="p-6">
              <h3 className="text-lg font-medium text-green-900 mb-4">Recent Transactions</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-green-900 border-b">
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Hospital</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1,2,3].map((item) => (
                      <tr key={item} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3">2023-09-{item.toString().padStart(2, '0')}</td>
                        <td>Military Hospital {item}</td>
                        <td>₦{Number(5000000 * item).toLocaleString()}</td>
                        <td>
                          <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
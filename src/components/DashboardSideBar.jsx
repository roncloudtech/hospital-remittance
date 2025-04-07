import React from "react";
import { NavLink } from 'react-router-dom';
import { ChartBarIcon, CurrencyDollarIcon, DocumentTextIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function DashboardSideBar() {
  return (
    <>
      <div className="fixed inset-y-0 left-0 bg-green-900 w-64 shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-yellow-400">
            Defence Health Portal
          </h2>
          <p className="text-gray-300 text-sm mt-2">
            Capitation Fund Management
          </p>
        </div>

        <nav className="mt-8">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium ${
                isActive
                  ? "bg-green-800 text-yellow-400"
                  : "text-gray-300 hover:bg-green-800"
              }`
            }
          >
            <ChartBarIcon className="h-5 w-5 mr-3" />
            Overview
          </NavLink>
          <NavLink
            to="/funds"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium ${
                isActive
                  ? "bg-green-800 text-yellow-400"
                  : "text-gray-300 hover:bg-green-800"
              }`
            }
          >
            <CurrencyDollarIcon className="h-5 w-5 mr-3" />
            Fund Allocation
          </NavLink>
          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium ${
                isActive
                  ? "bg-green-800 text-yellow-400"
                  : "text-gray-300 hover:bg-green-800"
              }`
            }
          >
            <DocumentTextIcon className="h-5 w-5 mr-3" />
            Transactions
          </NavLink>
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium ${
                isActive
                  ? "bg-green-800 text-yellow-400"
                  : "text-gray-300 hover:bg-green-800"
              }`
            }
          >
            <ShieldCheckIcon className="h-5 w-5 mr-3" />
            Reports
          </NavLink>
        </nav>
      </div>
    </>
  );
}

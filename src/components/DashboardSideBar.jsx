import React from "react";
import { NavLink } from 'react-router-dom';
import { 
  ChartBarIcon, 
  BuildingOfficeIcon, 
  DocumentTextIcon, 
  ShieldCheckIcon, 
  UserGroupIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

export default function DashboardSideBar() {
  const { user } = useAuth();

  return (
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
        {/* Common Links */}
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

        {/* Admin-only Links */}
        {user?.role === 'admin' && (
          <>
            <NavLink
              to="/manage-hospitals"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-sm font-medium ${
                  isActive
                    ? "bg-green-800 text-yellow-400"
                    : "text-gray-300 hover:bg-green-800"
                }`
              }
            >
              <BuildingOfficeIcon className="h-5 w-5 mr-3" />
              Manage Hospitals
            </NavLink>

            <NavLink
              to="/manage-users"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-sm font-medium ${
                  isActive
                    ? "bg-green-800 text-yellow-400"
                    : "text-gray-300 hover:bg-green-800"
                }`
              }
            >
              <UserGroupIcon className="h-5 w-5 mr-3" />
              Manage Users
            </NavLink>
          </>
        )}

        {/* Remitter Links */}
        {user?.role === 'remitter' && (
          <>
            <NavLink
              to="/remit-fund"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-sm font-medium ${
                  isActive
                    ? "bg-green-800 text-yellow-400"
                    : "text-gray-300 hover:bg-green-800"
                }`
              }
            >
              <ArrowUpIcon className="h-5 w-5 mr-3" />
              Remit Fund
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
          </>
        )}

        {/* Common Reports Link */}
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
  );
}
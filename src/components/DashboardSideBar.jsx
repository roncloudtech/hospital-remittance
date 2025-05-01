import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  ChartBarIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

export default function DashboardSideBar() {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const checkMobileView = () => {
    setIsMobileView(window.innerWidth < 768);
  };

  useEffect(() => {
    checkMobileView();
    window.addEventListener("resize", checkMobileView);
    return () => window.removeEventListener("resize", checkMobileView);
  }, []);

  const toggleSidebar = () => {
    if (isMobileView) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeMobileMenu = () => {
    if (isMobileView) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobileView && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-green-900 text-yellow-400 rounded-lg md:hidden"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-green-900 
        ${
          isMobileView
            ? `w-64 transform transition-transform duration-300 z-40 ${
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : `${isCollapsed ? "w-20" : "w-64"} shadow-lg`
        }
        `}
      >
        <div className="p-4 relative">
          {/* Desktop Toggle Button */}
          {!isMobileView && (
            <button
              onClick={toggleSidebar}
              className="absolute -right-3 top-6 bg-green-900 text-yellow-400 p-1.5 rounded-full border-2 border-yellow-400 hover:bg-green-800 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="h-4 w-4" />
              ) : (
                <ChevronLeftIcon className="h-4 w-4" />
              )}
            </button>
          )}

          {/* Logo and Title */}
          <div
            className={`${
              isCollapsed && !isMobileView ? "px-0" : "px-2"
            } overflow-hidden`}
          >
            <h2
              className={`text-2xl font-bold text-yellow-400 ${
                isCollapsed && !isMobileView ? "text-center" : ""
              }`}
            >
              {isCollapsed && !isMobileView
                ? "NAH"
                : "Nigerian Army Hospitals Portal"}
            </h2>
            {!isCollapsed && !isMobileView && (
              <p className="text-gray-300 text-sm mt-2">
                Capitation Fund Management
              </p>
            )}
          </div>
        </div>

        <nav className="mt-4">
          {/* Navigation Links */}
          <NavLink
            to="/dashboard"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium ${
                isActive
                  ? "bg-green-800 text-yellow-400"
                  : "text-gray-300 hover:bg-green-800"
              } ${isCollapsed && !isMobileView ? "justify-center" : "px-6"}`
            }
          >
            <ChartBarIcon className="h-5 w-5" />
            {(!isCollapsed || isMobileView) && (
              <span className="ml-3">Overview</span>
            )}
          </NavLink>
          {/* Admin-only Links */}
          {user?.role === "admin" && (
            <>
              <NavLink
                to="/manage-hospitals"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-green-800 text-yellow-400"
                      : "text-gray-300 hover:bg-green-800"
                  } ${isCollapsed ? "justify-center" : "px-6"}`
                }
              >
                <BuildingOfficeIcon className="h-5 w-5" />
                {!isCollapsed && <span className="ml-3">Manage Hospitals</span>}
              </NavLink>

              <NavLink
                to="/manage-users"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-green-800 text-yellow-400"
                      : "text-gray-300 hover:bg-green-800"
                  } ${isCollapsed ? "justify-center" : "px-6"}`
                }
              >
                <UserGroupIcon className="h-5 w-5" />
                {!isCollapsed && <span className="ml-3">Manage Users</span>}
              </NavLink>

              <NavLink
                to="/admin-reports"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-green-800 text-yellow-400"
                      : "text-gray-300 hover:bg-green-800"
                  } ${isCollapsed ? "justify-center" : "px-6"}`
                }
              >
                <ShieldCheckIcon className="h-5 w-5" />
                {!isCollapsed && <span className="ml-3">Admin Reports</span>}
              </NavLink>
            </>
          )}
          {/* Remitter Links */}
          {user?.role === "remitter" && (
            <>
              <NavLink
                to="/remit-fund"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-green-800 text-yellow-400"
                      : "text-gray-300 hover:bg-green-800"
                  } ${isCollapsed ? "justify-center" : "px-6"}`
                }
              >
                <ArrowUpIcon className="h-5 w-5" />
                {!isCollapsed && <span className="ml-3">Remit Fund</span>}
              </NavLink>

              <NavLink
                to="/remitter-reports"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-green-800 text-yellow-400"
                      : "text-gray-300 hover:bg-green-800"
                  } ${isCollapsed ? "justify-center" : "px-6"}`
                }
              >
                <ShieldCheckIcon className="h-5 w-5" />
                {!isCollapsed && <span className="ml-3">Reports</span>}
              </NavLink>
            </>
          )}
          {/* Common Reports Link */}
          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium ${
                isActive
                  ? "bg-green-800 text-yellow-400"
                  : "text-gray-300 hover:bg-green-800"
              } ${isCollapsed ? "justify-center" : "px-6"}`
            }
          >
            <DocumentTextIcon className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">Transactions</span>}
          </NavLink>

          {/* Logout Link */}
          <NavLink
            to="/logout"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium ${
                isActive
                  ? "bg-green-800 text-yellow-400"
                  : "text-gray-300 hover:bg-green-800"
              } ${isCollapsed ? "justify-center" : "px-6"}`
            }
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </NavLink>
        </nav>
      </div>

      {/* Mobile Overlay */}
      {isMobileView && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={closeMobileMenu}
        ></div>
      )}
    </>
  );
}

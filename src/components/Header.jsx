import React, { useState } from "react";
import { Link } from "react-router-dom";
import NigerianFlag from "../assets/nigeria-army.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white sticky top-0 z-10 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img
                style={{ objectFit: "contain" }}
                src={NigerianFlag}
                alt="Nigerian Flag"
                className="h-8 w-8 mr-2"
              />
              <span className="text-green-900 text-xl font-bold">
                Nigeria Army Health <span className="text-yellow-400">Services</span>
              </span>
            </Link>
          </div>

          {/* Desktop menu - Center */}
          <div className="hidden md:flex md:items-center md:space-x-8 md:ml-10">
            <Link
              to="/hospitals"
              className="text-green-900 hover:text-yellow-400 px-3 py-2 text-sm font-medium"
            >
              Military Hospitals
            </Link>
            <Link
              to="/services"
              className="text-green-900 hover:text-yellow-400 px-3 py-2 text-sm font-medium"
            >
              Services
            </Link>
            <Link
              to="/resources"
              className="text-green-900 hover:text-yellow-400 px-3 py-2 text-sm font-medium"
            >
              Resources
            </Link>
          </div>

          {/* Right side - Auth buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              to="/login"
              className="text-green-900 hover:text-yellow-400 px-3 py-2 text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/contact"
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-900 bg-yellow-400 hover:bg-yellow-500"
            >
              Contact Support
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-green-900 hover:text-yellow-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-400"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/hospitals"
              className="block px-3 py-2 rounded-md text-base font-medium text-green-900 hover:text-yellow-400 hover:bg-gray-100"
            >
              Military Hospitals
            </Link>
            <Link
              to="/services"
              className="block px-3 py-2 rounded-md text-base font-medium text-green-900 hover:text-yellow-400 hover:bg-gray-100"
            >
              Services
            </Link>
            <Link
              to="/resources"
              className="block px-3 py-2 rounded-md text-base font-medium text-green-900 hover:text-yellow-400 hover:bg-gray-100"
            >
              Resources
            </Link>
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="space-y-1 px-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-green-900 hover:text-yellow-400 hover:bg-gray-100"
                >
                  Personnel Login
                </Link>
                <Link
                  to="/contact"
                  className="block px-3 py-2 rounded-md text-base font-medium text-green-900 hover:text-yellow-400 hover:bg-gray-100"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;

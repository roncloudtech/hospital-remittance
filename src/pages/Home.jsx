import React from "react";
import { Link } from "react-router-dom";
import MilitaryHospitalImage from "../assets/flag.jpg"; // Add appropriate image
import NigerianFlag from "../assets/nigeria-army.png"; // Add flag image
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-green-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <img
                  style={{ objectFit: "contain" }}
                  src={NigerianFlag}
                  alt="Nigerian Flag"
                  className="h-16 w-16 mr-4"
                />
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Nigerian Army Hospitals <br />
                  <span className="text-yellow-400">
                    Capitation Fund Portal
                  </span>
                </h1>
              </div>
              <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-100">
                Secure and efficient management of healthcare funds for our
                nation's army personnel
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-green-900 bg-yellow-400 hover:bg-yellow-500"
                >
                Login
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center px-8 py-3 border border-white text-lg font-medium rounded-md text-white hover:bg-green-800"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-green-900 mb-12">
              Key Features for Military Healthcare
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-gray-50 rounded-lg border border-green-100">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 bg-green-800 p-3 rounded-md">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="ml-4 text-xl font-semibold text-green-900">
                    Secure Fund Allocation
                  </h3>
                </div>
                <p className="text-gray-600">
                  Military-grade encryption for all financial transactions and
                  personnel data
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg border border-green-100">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 bg-green-800 p-3 rounded-md">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="ml-4 text-xl font-semibold text-green-900">
                    Real-time Tracking
                  </h3>
                </div>
                <p className="text-gray-600">
                  Monitor fund disbursements across all nigeria army healthcare
                  facilities nationwide
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg border border-green-100">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 bg-green-800 p-3 rounded-md">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="ml-4 text-xl font-semibold text-green-900">
                    Role-based Access
                  </h3>
                </div>
                <p className="text-gray-600">
                  Hierarchical access control for military administrators and
                  healthcare providers
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Military Hospitals Section */}
        <section className="py-16 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div className="mb-8 lg:mb-0">
                <img
                  src={MilitaryHospitalImage}
                  alt="Nigerian Military Hospital"
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-green-900 mb-6">
                  Serving Our Armed Forces
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Dedicated to providing seamless healthcare fund management
                  for:
                </p>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-center">
                    <svg
                      className="h-6 w-6 text-green-800 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Army Medical Services
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-6 w-6 text-green-800 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Army Healthcare Facilities
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-6 w-6 text-green-800 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Army Medical Centers
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-6 w-6 text-green-800 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Veteran Healthcare Programs
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="p-6 border border-green-100 rounded-lg">
                <div className="text-3xl font-bold text-green-900">100+</div>
                <div className="text-gray-600 mt-2">Military Hospitals</div>
              </div>
              <div className="p-6 border border-green-100 rounded-lg">
                <div className="text-3xl font-bold text-green-900">₦25B+</div>
                <div className="text-gray-600 mt-2">Funds Managed</div>
              </div>
              <div className="p-6 border border-green-100 rounded-lg">
                <div className="text-3xl font-bold text-green-900">500K+</div>
                <div className="text-gray-600 mt-2">Personnel Served</div>
              </div>
              <div className="p-6 border border-green-100 rounded-lg">
                <div className="text-3xl font-bold text-green-900">24/7</div>
                <div className="text-gray-600 mt-2">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Home;

import React from "react";
import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <>
      <footer className="bg-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-yellow-400">
                Nigerian Army Health Services
              </h3>
              <p className="text-sm text-gray-300">
                Ensuring optimal healthcare funding for Nigeria's armed forces
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-yellow-400">
                Contact
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Command Finance Office, Arakan Cantonment,</li>
                <li> PMB 1339, Apapa, Lagos Nigeria.</li>
                <li>Email: hq.cfoapapa@army.mil.ng </li>
                <li>Phone: 09075768788</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-yellow-400">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/faq"
                    className="text-gray-300 hover:text-yellow-400"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/policy"
                    className="text-gray-300 hover:text-yellow-400"
                  >
                    Nigerian Army Health Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/training"
                    className="text-gray-300 hover:text-yellow-400"
                  >
                    Training Materials
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-yellow-400">
                Security
              </h3>
              <div className="text-sm text-gray-300">
                <p>ISO 27001 Certified</p>
                <p>NA ICT Policy Complaint</p>
                <p>Secure Military Network</p>
              </div>
            </div>
          </div>
          <div className="border-t border-green-800 mt-8 pt-8 text-center text-sm text-gray-300">
            <p>
              &copy; {new Date().getFullYear()} Nigerian Army Health
              Services. All rights reserved.
            </p>
            <p className="mt-2">NA Capitation Fund Remittance</p>
          </div>
        </div>
      </footer>
    </>
  );
}

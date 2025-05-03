import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import DashboardSideBar from "../components/DashboardSideBar";
import DashboardHeader from "../components/DashboardHeader";
import { Link } from "react-router-dom";

const RemitterReports = () => {
  const { authToken} = useAuth();
  const API_PUBLIC_URL = "https://api.namm.com.ng";
  const API_BASE_URL =process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/tickets`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.data.success) {
          setTickets(response.data.tickets);
        }
      } catch (error) {
        console.error("Failed to fetch remitter tickets", error);
      } finally {
        setLoading(false);
      }
    };

    // if (user?.id) {
      fetchTickets();
    // }
  }, [authToken, API_BASE_URL]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSideBar />
      <div className="md:ml-64">
        <DashboardHeader PageTitle="My Ticket Reports" />
        <main className="p-6">
          {/* Add Create Ticket */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100 mb-6">
            <h2 className="text-lg font-medium text-green-900 mb-4">
              Add New Ticket
            </h2>
            <Link
              to="/open-ticket"
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                loading ? "bg-gray-400" : "bg-green-900 hover:bg-green-800"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400`}
            >
              Open Ticket
            </Link>
          </div>
          {loading ? (
            <p>Loading your tickets...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border rounded bg-white shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 border">Subject</th>
                    <th className="py-3 px-4 border">Message</th>
                    <th className="py-3 px-4 border">Evidence</th>
                    <th className="py-3 px-4 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="py-2 px-4 border">{ticket.subject}</td>
                      <td className="py-2 px-4 border">{ticket.message}</td>
                      <td className="py-2 px-4 border">
                        {ticket.evidence_path ? (
                          // <a
                          //   href={`${API_BASE_URL.replace(
                          //     "/api",
                          //     ""
                          //   )}/storage/${ticket.evidence_path}`}
                          //   target="_blank"
                          //   rel="noopener noreferrer"
                          //   className="text-blue-600 underline"
                          // >
                          <a
                            href={`${API_PUBLIC_URL}/storage/${ticket.evidence_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View
                          </a>
                        ) : (
                          "None"
                        )}
                      </td>
                      <td className="py-2 px-4 border capitalize">
                      <span
                          className={`px-2 py-1 text-sm rounded-full ${
                            ticket.status === "resolved"
                              ? "bg-green-100 text-green-800"
                              : ticket.status === "open"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-500"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {tickets.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-4 text-gray-500"
                      >
                        No tickets submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RemitterReports;

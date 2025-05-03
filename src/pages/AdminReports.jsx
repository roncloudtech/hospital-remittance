import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import DashboardSideBar from "../components/DashboardSideBar";
import DashboardHeader from "../components/DashboardHeader";

const AdminReports = () => {
  const { authToken, user } = useAuth();
  const API_PUBLIC_URL = "https://api.namm.com.ng";
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicketsAndUsers = async () => {
      try {
        const [ticketsResponse, usersResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/admin/tickets`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }),
          axios.get(`${API_BASE_URL}/getusers`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }),
        ]);

        if (ticketsResponse.data.success) {
          setTickets(ticketsResponse.data.tickets);
        }

        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Failed to fetch tickets or users", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "admin") {
      fetchTicketsAndUsers();
    }
  }, [authToken, user, API_BASE_URL]);

  const getUserEmail = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user?.email || "N/A";
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/tickets/${ticketId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.success) {
        // Update ticket list with new status
        setTickets((prev) =>
          prev.map((t) =>
            t.id === ticketId ? { ...t, status: newStatus } : t
          )
        );
      }
    } catch (error) {
      console.error(`Failed to update status: ${error.message}`);
      alert("Error updating ticket status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSideBar />
      <div className="md:ml-64">
        <DashboardHeader PageTitle="Reports - Support Tickets" />
        <main className="p-6">
          {loading ? (
            <p>Loading tickets...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border rounded shadow-sm bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 border">User Email</th>
                    <th className="py-3 px-4 border">Subject</th>
                    <th className="py-3 px-4 border">Message</th>
                    <th className="py-3 px-4 border">Evidence</th>
                    <th className="py-3 px-4 border">Status</th>
                    <th className="py-3 px-4 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="py-2 px-4 border">
                        {getUserEmail(ticket.user_id)}
                      </td>
                      <td className="py-2 px-4 border">{ticket.subject}</td>
                      <td className="py-2 px-4 border">{ticket.message}</td>
                      <td className="py-2 px-4 border">
                        {ticket.evidence_path ? (
                          <a
                            href={`${API_PUBLIC_URL}/storage/${ticket.evidence_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View Evidence
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
                      <td className="py-2 px-4 border">
                        <button
                          onClick={() =>
                            updateTicketStatus(ticket.id, "resolved")
                          }
                          className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-2"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() =>
                            updateTicketStatus(ticket.id, "closed")
                          }
                          className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                        >
                          Close
                        </button>
                      </td>
                    </tr>
                  ))}
                  {tickets.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-4 text-gray-500"
                      >
                        No tickets available.
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

export default AdminReports;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import DashboardSideBar from "../components/DashboardSideBar";
import DashboardHeader from "../components/DashboardHeader";
import { formatDistanceToNow } from "date-fns";
import { Eye } from "lucide-react";

const AdminReports = () => {
  const { authToken, user } = useAuth();
  const API_PUBLIC_URL = "https://hosapi.nafcservices.com.ng";
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openAccordion, setOpenAccordion] = useState({
    open: true,
    resolved: false,
    closed: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketsRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/admin/tickets`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          axios.get(`${API_BASE_URL}/getusers`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
        ]);

        if (ticketsRes.data.success) setTickets(ticketsRes.data.tickets);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "admin") fetchData();
  }, [authToken, user, API_BASE_URL]);

  const getUserEmail = (userId) => users.find((u) => u.id === userId)?.email || "N/A";

  const isOlderThan24Hours = (date) => new Date() - new Date(date) > 86400000;

  const timeAgo = (date) => formatDistanceToNow(new Date(date), { addSuffix: true });

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/admin/tickets/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (res.data.success) {
        setTickets((prev) =>
          prev.map((ticket) =>
            ticket.id === id
              ? { ...ticket, status, updated_at: new Date().toISOString() }
              : ticket
          )
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err.message);
      alert("Error updating ticket status");
    }
  };

  const renderStatusBadge = (status) => {
    const statusStyles = {
      resolved: "bg-green-100 text-green-800",
      open: "bg-yellow-100 text-yellow-800",
      closed: "bg-red-100 text-red-700",
    };
    return (
      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusStyles[status] || ""}`}>
        {status}
      </span>
    );
  };
  const renderTicketCard = (ticket) => {
    const disableClose = ticket.status === "resolved" && isOlderThan24Hours(ticket.updated_at);
  
    return (
      <div key={ticket.id} className="bg-white shadow-md rounded-lg p-5 border border-gray-200 mb-4 w-64">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-800">{ticket.subject}</h3>
          <p className="text-sm text-gray-500">{getUserEmail(ticket.user_id)}</p>
        </div>
        <p className="mb-2 text-gray-700">
          <span className="font-medium">Message:</span> {ticket.message}
        </p>
        <div className="mb-2">
          <span className="font-medium">Evidence:</span>{" "}
          {ticket.evidence_path ? (
            <a
              href={`${API_PUBLIC_URL}/storage/${ticket.evidence_path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-1 text-blue-600 font-medium hover:underline"
            >
              <Eye size={16} /> View Evidence
            </a>
          ) : (
            <span className="text-gray-500">None</span>
          )}
        </div>
        <p className="mb-1 text-sm text-gray-600">
          <strong>Reported:</strong> {timeAgo(ticket.created_at)}
        </p>
        {ticket.status !== "open" && (
          <p className="mb-1 text-sm text-gray-600">
            <strong>Resolved/Closed:</strong> {timeAgo(ticket.updated_at)}
          </p>
        )}
        <p className="mb-4">
          <span className="font-medium">Status:</span> {renderStatusBadge(ticket.status)}
        </p>
        <div className="flex space-x-3">
          <button
            onClick={() => updateStatus(ticket.id, "resolved")}
            className={`flex-1 text-sm px-3 py-2 rounded ${
              ticket.status === "resolved"
                ? "bg-gray-300 cursor-not-allowed text-white"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
            disabled={ticket.status === "resolved"}
          >
            Resolve
          </button>
          <button
            onClick={() => updateStatus(ticket.id, "closed")}
            className={`flex-1 text-sm px-3 py-2 rounded ${
              disableClose || ticket.status === "closed"
                ? "bg-gray-300 cursor-not-allowed text-white"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
            disabled={disableClose || ticket.status === "closed"}
          >
            Close
          </button>
        </div>
      </div>
    );
  };
  
  const categorizedTickets = {
    open: tickets.filter((t) => t.status === "open"),
    resolved: tickets.filter((t) => t.status === "resolved"),
    closed: tickets.filter((t) => t.status === "closed"),
  };

  const renderAccordionSection = (label, key) => (


      <div className="mb-6">
        <button
          onClick={() => setOpenAccordion((prev) => ({ ...prev, [key]: !prev[key] }))}
          className="w-full text-left bg-gray-200 px-4 py-2 font-semibold text-gray-800 rounded"
        >
          {label} ({categorizedTickets[key].length}) {openAccordion[key] ? "▲" : "▼"}
        </button>
        {openAccordion[key] && (
          <div className="mt-2 flex flex-wrap gap-2">
            {categorizedTickets[key].length > 0 ? (
              categorizedTickets[key].map((ticket) => renderTicketCard(ticket))
            ) : (
              <p className="text-sm text-gray-500 mt-2">No {label.toLowerCase()} tickets.</p>
            )}
          </div>
        )}
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSideBar />
      <div className="md:ml-64">
        <DashboardHeader PageTitle="Reports - Support Tickets" />
        <main className="p-6">
          {loading ? (
            <p>Loading tickets...</p>
          ) : (
            <>
              {renderAccordionSection("Open Tickets", "open")}
              {renderAccordionSection("Resolved Tickets", "resolved")}
              {renderAccordionSection("Closed Tickets", "closed")}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminReports;
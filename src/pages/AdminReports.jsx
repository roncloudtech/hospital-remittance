import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import DashboardSideBar from "../components/DashboardSideBar";
import DashboardHeader from "../components/DashboardHeader";
import { formatDistanceToNow } from "date-fns";
import { Eye } from "lucide-react";

const AdminReports = () => {
  const { authToken, user } = useAuth();
  const API_PUBLIC_URL = "https://api.namm.com.ng";
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, [authToken, user]);

  const getUserEmail = (userId) => users.find((u) => u.id === userId)?.email || "N/A";

  const isOlderThan24Hours = (date) => new Date() - new Date(date) > 86400000;

  const timeAgo = (date) => formatDistanceToNow(new Date(date), { addSuffix: true });

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/admin/tickets/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (res.data.success) {
        setTickets((prev) =>
          prev.map((ticket) =>
            ticket.id === id ? { ...ticket, status, updated_at: new Date().toISOString() } : ticket
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSideBar />
      <div className="md:ml-64">
        <DashboardHeader PageTitle="Reports - Support Tickets" />
        <main className="p-6">
          {loading ? (
            <p>Loading tickets...</p>
          ) : tickets.length === 0 ? (
            <p className="text-center text-gray-500">No tickets available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.map((ticket) => {
                const disabled = isOlderThan24Hours(ticket.created_at);
                return (
                  <div
                    key={ticket.id}
                    className="bg-white shadow-md rounded-lg p-5 border border-gray-200"
                  >
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
                          disabled
                            ? "bg-gray-300 cursor-not-allowed text-white"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                        disabled={disabled}
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => updateStatus(ticket.id, "closed")}
                        className={`flex-1 text-sm px-3 py-2 rounded ${
                          disabled
                            ? "bg-gray-300 cursor-not-allowed text-white"
                            : "bg-gray-600 text-white hover:bg-gray-700"
                        }`}
                        disabled={disabled}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminReports;




// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import DashboardSideBar from "../components/DashboardSideBar";
// import DashboardHeader from "../components/DashboardHeader";

// const AdminReports = () => {
//   const { authToken, user } = useAuth();
//   const API_PUBLIC_URL = "https://api.namm.com.ng";
//   const API_BASE_URL =
//     process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

//   const [tickets, setTickets] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTicketsAndUsers = async () => {
//       try {
//         const [ticketsResponse, usersResponse] = await Promise.all([
//           axios.get(`${API_BASE_URL}/admin/tickets`, {
//             headers: {
//               Authorization: `Bearer ${authToken}`,
//             },
//           }),
//           axios.get(`${API_BASE_URL}/getusers`, {
//             headers: {
//               Authorization: `Bearer ${authToken}`,
//             },
//           }),
//         ]);

//         if (ticketsResponse.data.success) {
//           setTickets(ticketsResponse.data.tickets);
//         }

//         setUsers(usersResponse.data);
//       } catch (error) {
//         console.error("Failed to fetch tickets or users", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user?.role === "admin") {
//       fetchTicketsAndUsers();
//     }
//   }, [authToken, user, API_BASE_URL]);

//   const getUserEmail = (userId) => {
//     const user = users.find((u) => u.id === userId);
//     return user?.email || "N/A";
//   };

//   const updateTicketStatus = async (ticketId, newStatus) => {
//     try {
//       const response = await axios.put(
//         `${API_BASE_URL}/admin/tickets/${ticketId}/status`,
//         { status: newStatus },
//         {
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         // Update ticket list with new status
//         setTickets((prev) =>
//           prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
//         );
//       }
//     } catch (error) {
//       console.error(`Failed to update status: ${error.message}`);
//       alert("Error updating ticket status");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <DashboardSideBar />
//       <div className="md:ml-64">
//         <DashboardHeader PageTitle="Reports - Support Tickets" />
//         <main className="p-6">
//           {loading ? (
//             <p>Loading tickets...</p>
//           ) : tickets.length === 0 ? (
//             <p className="text-center text-gray-500">No tickets available.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {tickets.map((ticket) => (
//                 <div
//                   key={ticket.id}
//                   className="bg-white shadow-md rounded-lg p-5 border border-gray-200"
//                 >
//                   <div className="mb-3">
//                     <h3 className="text-lg font-semibold text-gray-800">
//                       {ticket.subject}
//                     </h3>
//                     <p className="text-sm text-gray-500">
//                       {getUserEmail(ticket.user_id)}
//                     </p>
//                   </div>
//                   <p className="mb-2 text-gray-700">
//                     <span className="font-medium">Message:</span>{" "}
//                     {ticket.message}
//                   </p>
//                   <p className="mb-2">
//                     <span className="font-medium">Evidence:</span>{" "}
//                     {ticket.evidence_path ? (
//                       <a
//                         href={`${API_PUBLIC_URL}/storage/${ticket.evidence_path}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 underline"
//                       >
//                         View Evidence
//                       </a>
//                     ) : (
//                       "None"
//                     )}
//                   </p>
//                   <p className="mb-4">
//                     <span className="font-medium">Status:</span>{" "}
//                     <span
//                       className={`inline-block px-2 py-1 text-xs font-semibold rounded-full capitalize ${
//                         ticket.status === "resolved"
//                           ? "bg-green-100 text-green-800"
//                           : ticket.status === "open"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : "bg-red-100 text-red-700"
//                       }`}
//                     >
//                       {ticket.status}
//                     </span>
//                   </p>
//                   <div className="flex space-x-3">
//                     <button
//                       onClick={() => updateTicketStatus(ticket.id, "resolved")}
//                       className="flex-1 bg-green-600 text-white text-sm px-3 py-2 rounded hover:bg-green-700"
//                     >
//                       Resolve
//                     </button>
//                     <button
//                       onClick={() => updateTicketStatus(ticket.id, "closed")}
//                       className="flex-1 bg-gray-600 text-white text-sm px-3 py-2 rounded hover:bg-gray-700"
//                     >
//                       Close
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminReports;

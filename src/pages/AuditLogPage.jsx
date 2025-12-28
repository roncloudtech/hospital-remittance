import React, { useEffect, useState } from "react";
import DashboardSideBar from "../components/DashboardSideBar";
import DashboardHeader from "../components/DashboardHeader";
import { useAuth } from "../context/AuthContext";
import { FunnelIcon } from "@heroicons/react/24/outline";

export default function AuditLogPage() {
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL ?? "http://localhost:8000/api";
  const { authToken } = useAuth();

  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    actor_role: "",
    action: "",
    ip_address: "",
    from_date: "",
    to_date: "",
  });

  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  const fetchLogs = async (url = `${API_BASE_URL}/audit-logs`) => {
    try {
      const params = new URLSearchParams(filters).toString();

      const res = await fetch(`${url}?${params}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      setLogs(data.logs.data);
      setPagination(data.logs);
    } catch (error) {
      console.error("Failed to fetch audit logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) fetchLogs();
  }, [authToken]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    setLoading(true);
    fetchLogs();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSideBar />

      <div className="md:ml-64">
        <DashboardHeader PageTitle="Audit Logs" />

        <div className="p-6 max-w-7xl mx-auto">
          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            <input
              name="action"
              placeholder="Action"
              onChange={handleFilterChange}
              className="border p-2 rounded"
            />
            <select
              name="actor_role"
              onChange={handleFilterChange}
              className="border p-2 rounded"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="remitter">Remitter</option>
            </select>
            <input
              name="ip_address"
              placeholder="IP Address"
              onChange={handleFilterChange}
              className="border p-2 rounded"
            />
            <input
              type="date"
              name="from_date"
              onChange={handleFilterChange}
              className="border p-2 rounded"
            />
            <input
              type="date"
              name="to_date"
              onChange={handleFilterChange}
              className="border p-2 rounded"
            />
          </div>

          <button
            onClick={applyFilters}
            className="mb-4 bg-green-900 text-white px-4 py-2 rounded"
          >
            Apply Filters
            <FunnelIcon className="inline-block w-4 h-4 ml-2" />
          </button>

          {/* Table */}
          {loading ? (
            <p>Loading audit logs...</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3">Actor</th>
                    <th>Role</th>
                    <th>Action</th>
                    <th>Description</th>
                    <th>IP</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-t">
                      <td className="p-3 font-medium">{log.actor_name}</td>

                      <td>{log.actor_role}</td>
                      <td className="font-semibold">{log.action}</td>
                      <td>{log.description}</td>
                      <td>{log.ip_address}</td>
                      <td>{new Date(log.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>

                {/* <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-t">
                      <td className="p-3">{log.actor_id}</td>
                      <td>{log.actor_role}</td>
                      <td className="font-semibold">{log.action}</td>
                      <td>{log.description}</td>
                      <td>{log.ip_address}</td>
                      <td>{new Date(log.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody> */}
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <button
              disabled={!pagination.prev_page_url}
              onClick={() => fetchLogs(pagination.prev_page_url)}
            >
              Previous
            </button>

            <button
              disabled={!pagination.next_page_url}
              onClick={() => fetchLogs(pagination.next_page_url)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

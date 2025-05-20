import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardSideBar from "../components/DashboardSideBar";
import DashboardHeader from "../components/DashboardHeader";
import { useAuth } from "../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { format } from "date-fns";

const MonthlyTarget = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const { user, authToken } = useAuth();
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [remitters, setRemitters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    remitter: "",
    month: new Date(),
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchHospitals = async () => {
      setLoading(true);
      try {
        const endpoint =
          user?.role === "admin"
            ? `${API_BASE_URL}/hospitals`
            : `${API_BASE_URL}/remitter/hospitals`;

        const params = {
          month: format(filters.month, "yyyy-MM"),
        };

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${authToken}` },
          params,
        });

        const data = response.data.data;
        setHospitals(data);
        setFilteredHospitals(data);

        if (user?.role === "admin") {
          const uniqueRemitters = [
            ...new Set(data.map((h) => h.remitter_name).filter(Boolean)),
          ];
          setRemitters(uniqueRemitters);
        }
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [filters.month, authToken, user?.role, API_BASE_URL]);

  useEffect(() => {
    let filtered = [...hospitals];

    if (filters.search) {
      filtered = filtered.filter((h) =>
        h.hospital_name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (user?.role === "admin" && filters.remitter) {
      filtered = filtered.filter((h) => h.remitter_name === filters.remitter);
    }

    setFilteredHospitals(filtered);
    setCurrentPage(1);
  }, [filters, hospitals, user?.role]);

  const handleCSVExport = () => {
    const data = filteredHospitals.map((h) => ({
      Hospital: h.hospital_name,
      "Monthly Target": h.monthly_target,
      "Total Paid": h.total_paid,
      Balance: h.balance,
      ...(user?.role === "admin" && { Remitter: h.remitter_name }),
      Month: format(filters.month, "MM/yyyy"),
    }));

    if (data.length > 0) {
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `hospitals_${Date.now()}.csv`);
    } else {
      alert("No data to export");
    }
  };

  const totalPages = Math.ceil(filteredHospitals.length / itemsPerPage);
  const paginatedData = filteredHospitals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSideBar />
      <div className="md:ml-64">
        <DashboardHeader PageTitle="Hospitals" />
        <main className="p-6">
          <div className="flex flex-wrap gap-4 mb-4">
            <input
              type="text"
              placeholder="Search hospitals..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="border px-3 py-2 rounded-md"
            />

            {user?.role === "admin" && (
              <select
                value={filters.remitter}
                onChange={(e) =>
                  setFilters({ ...filters, remitter: e.target.value })
                }
                className="border px-3 py-2 rounded-md"
              >
                <option value="">All Remitters</option>
                {remitters.map((remitter) => (
                  <option key={remitter} value={remitter}>
                    {remitter}
                  </option>
                ))}
              </select>
            )}

            <DatePicker
              selected={filters.month}
              onChange={(date) => setFilters({ ...filters, month: date })}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              className="border px-3 py-2 rounded-md"
            />

            <button
              onClick={handleCSVExport}
              className="bg-green-900 text-white px-4 py-2 rounded-md hover:bg-green-800"
            >
              Export CSV
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading hospitals...</p>
          ) : paginatedData.length === 0 ? (
            <p className="text-center text-gray-500">No hospitals found</p>
          ) : (
            <div className="overflow-x-auto bg-white p-4 rounded-lg shadow border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-green-900 border-b">
                    <th className="pb-3">Hospital</th>
                    <th className="pb-3">Monthly Target</th>
                    <th className="pb-3">Total Paid</th>
                    <th className="pb-3">Balance</th>
                    {user?.role === "admin" && <th className="pb-3">Remitter</th>}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((hospital) => (
                    <tr
                      key={hospital.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3">{hospital.hospital_name}</td>
                      <td>₦{Number(hospital.monthly_target).toLocaleString()}</td>
                      <td>₦{Number(hospital.total_paid).toLocaleString()}</td>
                      <td>₦{Number(hospital.balance).toLocaleString()}</td>
                      {user?.role === "admin" && (
                        <td>{hospital.remitter_name || "N/A"}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-green-900 text-white rounded disabled:bg-gray-300"
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-green-900 text-white rounded disabled:bg-gray-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MonthlyTarget;
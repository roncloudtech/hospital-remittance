import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardSideBar from "../components/DashboardSideBar";
import DashboardHeader from "../components/DashboardHeader";
import { useAuth } from "../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const Transactions = () => {
  const { user, authToken } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    hospital: "",
    startDate: null,
    endDate: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const endpoint =
    user?.role === "admin"
      ? "http://localhost:8000/api/allremittances"
      : "http://localhost:8000/api/getremittances";

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = res.data.data?.data || [];
        setTransactions(data);
        setFiltered(data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [endpoint, authToken]);

  // Filtering
  useEffect(() => {
    let data = [...transactions];

    if (filters.status) {
      data = data.filter((tx) => tx.payment_status === filters.status);
    }
    if (filters.hospital) {
      data = data.filter(
        (tx) => tx.hospital?.hospital_name === filters.hospital
      );
    }
    if (filters.startDate && filters.endDate) {
      data = data.filter((tx) => {
        const txDate = new Date(tx.transaction_date);
        return txDate >= filters.startDate && txDate <= filters.endDate;
      });
    }

    setFiltered(data);
    setCurrentPage(1);
  }, [filters, transactions]);

  const hospitals = [
    ...new Set(transactions.map((tx) => tx.hospital?.hospital_name)),
  ];

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCSVExport = () => {
    const data = filtered.map((tx) => ({
      Date: new Date(tx.transaction_date).toLocaleDateString(),
      Hospital: tx.hospital?.hospital_name || "N/A",
      Amount: tx.amount,
      Status: tx.payment_status,
      Reference: tx.payment_reference,
    }));

    if (data.length > 0) {
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "transaction_" + Date.now() + ".csv");
    } else {
      alert("No record found");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSideBar />
      <div className="md:ml-64">
        <DashboardHeader PageTitle="Transactions" />
        <main className="p-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-4">
            <select
              value={filters.hospital}
              onChange={(e) =>
                setFilters({ ...filters, hospital: e.target.value })
              }
              className="border px-3 py-2 rounded-md"
            >
              <option value="">All Hospitals</option>
              {hospitals.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="border px-3 py-2 rounded-md"
            >
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
            </select>

            <div className="flex gap-2 items-center">
              <DatePicker
                selected={filters.startDate}
                onChange={(date) => setFilters({ ...filters, startDate: date })}
                selectsStart
                startDate={filters.startDate}
                endDate={filters.endDate}
                placeholderText="Start Date"
                className="border px-3 py-2 rounded-md"
              />
              <DatePicker
                selected={filters.endDate}
                onChange={(date) => setFilters({ ...filters, endDate: date })}
                selectsEnd
                startDate={filters.startDate}
                endDate={filters.endDate}
                minDate={filters.startDate}
                placeholderText="End Date"
                className="border px-3 py-2 rounded-md"
              />
            </div>

            <button
              onClick={handleCSVExport}
              className="bg-green-900 text-white px-4 py-2 rounded-md hover:bg-green-800"
            >
              Export CSV
            </button>
          </div>

          {/* Transactions Table */}
          {loading ? (
            <p className="text-center text-gray-500">Loading transactions...</p>
          ) : paginated.length === 0 ? (
            <p className="text-center text-gray-500">No transactions found.</p>
          ) : (
            <div className="overflow-x-auto bg-white p-4 rounded-lg shadow border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-green-900 border-b">
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Hospital</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Reference</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((tx) => (
                    <tr key={tx.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">
                        {new Date(tx.transaction_date).toLocaleDateString()}
                      </td>
                      <td>{tx.hospital?.hospital_name || "N/A"}</td>
                      <td>₦{Number(tx.amount).toLocaleString()}</td>
                      <td>{tx.payment_reference || "N/A"}</td>
                      <td>
                        <span
                          className={`px-2 py-1 text-sm rounded-full ${
                            tx.payment_status === "success"
                              ? "bg-green-100 text-green-800"
                              : tx.payment_status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-500"
                          }`}
                        >
                          {tx.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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

export default Transactions;

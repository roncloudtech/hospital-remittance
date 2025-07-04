import axios from "axios";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React, { useEffect, useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import DashboardSideBar from "../components/DashboardSideBar";

const Dashboard = () => {
  // Base API URL
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const { user, authToken } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [hospitalSummaries, setHospitalSummaries] = useState([]);

  const [loading, setLoading] = useState(true);

  const [totalTarget, setTotalTarget] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalAmountPaid, setTotalAmountPaid] = useState(0);

  const [totalFunds, setTotalFunds] = useState(0);
  const [recentFunds, setRecentFunds] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const endpoint =
          user?.role === "admin"
            ? `${
                API_BASE_URL ? API_BASE_URL : "http://localhost:8000/api"
              }/allremittances`
            : `${
                API_BASE_URL ? API_BASE_URL : "http://localhost:8000/api"
              }/getremittances`;

        const res = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (res.data.success) {
          const data = res.data.data?.data || [];
          setTransactions(data);

          const now = new Date();
          const sevenDaysAgo = new Date(now);
          sevenDaysAgo.setDate(now.getDate() - 7);

          let total = 0;
          let recent = 0;
          let pending = 0;

          data.forEach((tx) => {
            const amount = Number(tx.amount);
            const txDate = new Date(tx.transaction_date);
            const status = tx.payment_status?.toLowerCase();

            if (status === "success") {
              total += amount;
              if (txDate >= sevenDaysAgo) {
                recent += amount;
              }
            }

            if (status === "pending" || status === "awaiting") {
              pending += 1;
            }
          });

          setTotalFunds(total);
          setRecentFunds(recent);
          setPendingCount(pending);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user, authToken, API_BASE_URL]);

  useEffect(() => {
    const fetchHospitalSummaries = async () => {
      try {
        const endpoint =
          user.role === "remitter"
            ? `${
                API_BASE_URL ? API_BASE_URL : "http://localhost:8000/api"
              }/remitter-hospitals-summary`
            : `${
                API_BASE_URL ? API_BASE_URL : "http://localhost:8000/api"
              }/admin-hospitals-summary`;
        const res = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (res.data.success) {
          const summaries = res.data.data;
          setHospitalSummaries(res.data.data);

          let targetSum = 0;
          let paidSum = 0;
          let balanceSum = 0;

          summaries.forEach((hospital) => {
            const monthlyTarget = Number(hospital.monthly_target);
            (hospital.records || []).forEach((record) => {
              targetSum += monthlyTarget;
              paidSum += Number(record.amount_paid);
              balanceSum += Number(record.balance);
            });
          });

          setTotalTarget(targetSum);
          setTotalAmountPaid(paidSum);
          setTotalBalance(balanceSum);
        }
      } catch (error) {
        console.error("Error fetching hospital summaries:", error);
      }
    };

    fetchHospitalSummaries();
  }, [hospitalSummaries, user, authToken, API_BASE_URL]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSideBar />

      <div className="md:ml-64">
        <DashboardHeader PageTitle="Dashboard" />

        <main className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-medium text-green-900">
                Total Funds
              </h3>
              <p className="text-2xl font-bold mt-2">
                ₦{totalFunds.toLocaleString()}
              </p>
              <span className="text-sm text-green-600">Approved Payments</span>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-medium text-green-900">
                Recent Transactions
              </h3>
              <p className="text-2xl font-bold mt-2">
                ₦{recentFunds.toLocaleString()}
              </p>
              <span className="text-sm text-green-600">Last 7 days</span>
            </div>

            <NavLink
              to={user.role === "admin" ? "/pending-approvals" : "/dashboard"}
            >
              <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
                <h3 className="text-lg font-medium text-green-900">
                  Pending Approvals
                </h3>
                <p className="text-2xl font-bold mt-2">
                  {pendingCount} Requests
                </p>
                <span className="text-sm text-green-600">
                  {pendingCount > 1
                    ? "Multiple Pending"
                    : pendingCount + " Request"}
                </span>
              </div>
            </NavLink>

            <NavLink to={"/monthly-target"}>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-medium text-green-900">
                Total Target
              </h3>
              <p className="text-2xl font-bold mt-2">
                ₦{totalTarget.toLocaleString()}
              </p>
              <span className="text-sm text-green-600">Expected Payments</span>
            </div>
            </NavLink>
            
            <NavLink to={"/monthly-target"}>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-medium text-green-900">
                Amount Paid
              </h3>
              <p className="text-2xl font-bold mt-2">
                ₦{totalAmountPaid.toLocaleString()}
              </p>
              <span className="text-sm text-green-600">Total Received</span>
            </div>
            </NavLink>
            
            <NavLink to={"/monthly-target"}>
            <div className={`bg-white p-6 rounded-lg shadow-sm border border-green-100 ${(totalBalance < 0) ? 'text-red-700 bg-red-300': 'text-black'}`}>
              <h3 className="text-lg font-medium text-black">
                Outstanding Balance
              </h3>
              <p className="text-2xl font-bold mt-2">
                ₦{totalBalance.toLocaleString()}
              </p>
              <span className="text-sm text-black">
                Amount Yet to be Paid
              </span>
            </div>
            </NavLink>
          </div>

          {/* Recent Transactions Table */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-green-100">
            <div className="p-6">
              <h3 className="text-lg font-medium text-green-900 mb-4">
                Recent Transactions
              </h3>

              {loading ? (
                <p className="text-center text-gray-500">
                  Loading transactions...
                </p>
              ) : transactions.length === 0 ? (
                <p className="text-center text-gray-500">
                  No transactions found.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-green-900 border-b">
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Hospital</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.slice(0, 10).map((tx) => (
                        <tr
                          key={tx.id}
                          className="border-b last:border-0 hover:bg-gray-50"
                        >
                          <td className="py-3">
                            {new Date(tx.transaction_date).toLocaleDateString()}
                          </td>
                          <td>{tx.hospital?.hospital_name || "N/A"}</td>
                          <td>₦{Number(tx.amount).toLocaleString()}</td>
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
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

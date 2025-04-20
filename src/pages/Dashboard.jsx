import React, { useEffect, useState } from 'react';
import DashboardSideBar from '../components/DashboardSideBar';
import DashboardHeader from '../components/DashboardHeader';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user, authToken } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const endpoint =
          user?.role === 'admin'
            ? 'http://localhost:8000/api/getremittances'
            : 'http://localhost:8000/api/getremittances';

        const res = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        // if (res.data.success) {
        //   setTransactions(res.data.remittances || []);
        // }

        if (res.data.success) {
          setTransactions(res.data.data?.data || []);
        }
        
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user, authToken]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSideBar />

      <div className="md:ml-64">
        <DashboardHeader PageTitle="Dashboard" />

        <main className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-medium text-green-900">Total Funds</h3>
              <p className="text-2xl font-bold mt-2">₦250,000,000</p>
              <span className="text-sm text-green-600">+2.5% from last month</span>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-medium text-green-900">Recent Transactions</h3>
              <p className="text-2xl font-bold mt-2">₦15,200,000</p>
              <span className="text-sm text-green-600">Last 7 days</span>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-medium text-green-900">Pending Approvals</h3>
              <p className="text-2xl font-bold mt-2">3 Requests</p>
              <span className="text-sm text-green-600">2 Urgent</span>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-medium text-green-900 mb-4">Monthly Fund Utilization</h3>
              <div className="h-64 bg-gray-50 rounded-md"></div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-medium text-green-900 mb-4">Expenditure Trends</h3>
              <div className="h-64 bg-gray-50 rounded-md"></div>
            </div>
          </div>

          {/* Recent Transactions Table */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-green-100">
            <div className="p-6">
              <h3 className="text-lg font-medium text-green-900 mb-4">Recent Transactions</h3>

              {loading ? (
                <p className="text-center text-gray-500">Loading transactions...</p>
              ) : transactions.length === 0 ? (
                <p className="text-center text-gray-500">No transactions found.</p>
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
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="border-b last:border-0 hover:bg-gray-50">
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
                                  : "bg-yellow-100 text-yellow-800"
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


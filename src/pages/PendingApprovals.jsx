import React, { useEffect, useState } from 'react';
import DashboardSideBar from '../components/DashboardSideBar';
import DashboardHeader from '../components/DashboardHeader';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const PendingApprovals = () => {
  // Base API URL
  const API_PUBLIC_URL = "https://api.nafcservices.com.ng";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const { user, authToken } = useAuth();
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);


  useEffect(() => {
    const fetchPending = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL ? API_BASE_URL : 'http://localhost:8000/api'}/allremittances`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        console.log(res.data.data.data)
        if (res.data.success) {
          const pending = res.data.data.data.filter(
            (tx) => tx.payment_status?.toLowerCase() === 'pending'
          );
          
          setPendingTransactions(pending);
        }
      } catch (error) {
        console.error('Error fetching pending transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchPending();
    }
  }, [user, authToken, API_BASE_URL]);

  const handleAction = async (id, action) => {
    setActionLoading(true);
    try {
      await axios.patch(
        `${API_BASE_URL ? API_BASE_URL : 'http://localhost:8000/api'}/updateremittance/${id}/${action}`,
        {}, // send empty body or data if not required
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Remove the item from UI
      setPendingTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (error) {
      console.error(`Failed to ${action} transaction`, error);
      alert(`Failed to ${action} transaction`);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePreview = (evidenceUrl) => {
    console.log(evidenceUrl);
    if (!evidenceUrl) return alert("No payment evidence available.");
    const fullUrl = `${API_PUBLIC_URL || 'http://localhost:8000'}/storage/${evidenceUrl}`;
    setPreviewUrl(fullUrl);
    console.log(fullUrl);
  };

  if (user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSideBar />

      <div className="md:ml-64">
        <DashboardHeader PageTitle="Pending Approvals" />

        <main className="p-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-green-100">
            <h3 className="text-lg font-medium text-green-900 mb-4">Pending Transactions</h3>

            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : pendingTransactions.length === 0 ? (
              <p className="text-center text-gray-500">No pending transactions.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-green-900 border-b">
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Hospital</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Evidence</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3">
                          {new Date(tx.transaction_date).toLocaleDateString()}
                        </td>
                        <td>{tx.hospital?.hospital_name || 'N/A'}</td>
                        <td>₦{Number(tx.amount).toLocaleString()}</td>
                        <td>
                          <span className="px-2 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        </td>

                        <td>
                          {tx.payment_evidence ? (
                            
                            <button
                              onClick={() => handlePreview(tx.payment_evidence)}
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:text-blue-800 text-sm"
                            >
                              Preview
                            </button>
                          ) : (
                            <span className="text-gray-400 text-sm">No file</span>
                          )}
                        </td>

                        <td className="flex gap-2 py-2">
                          <button
                            onClick={() => handleAction(tx.id, 'success')}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                            disabled={actionLoading}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(tx.id, 'decline')}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                            disabled={actionLoading}
                          >
                            Decline
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl w-full relative">
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            {previewUrl.endsWith('.pdf') ? (
              <iframe
                src={previewUrl}
                className="w-full h-[500px] border rounded"
                title="PDF Preview"
              />
            ) : (
              <img
                src={previewUrl}
                alt="Evidence Preview"
                className="w-full max-h-[500px] object-contain rounded"
              />
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default PendingApprovals;

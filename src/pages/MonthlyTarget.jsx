import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardSideBar from "../components/DashboardSideBar";
import DashboardHeader from "../components/DashboardHeader";
import { useAuth } from "../context/AuthContext";
import "react-datepicker/dist/react-datepicker.css";

const MonthlyTarget = () => {
  // Base API URL
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const { user, authToken } = useAuth();
  const [hospitalSummaries, setHospitalSummaries] = useState([]);

  const [loading, setLoading] = useState(true);

  const [totalTarget, setTotalTarget] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalAmountPaid, setTotalAmountPaid] = useState(0);

  useEffect(() => {
    const fetchHospitalSummaries = async () => {
      try {
        setLoading(true);
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
          setLoading(false);
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
        setLoading(false);
        console.error("Error fetching hospital summaries:", error);
      }
    };

    fetchHospitalSummaries();
  }, [user, authToken, API_BASE_URL]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSideBar />
      <div className="md:ml-64">
        <DashboardHeader PageTitle="Hospitals" />
        <main className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-medium text-green-900">
                Total Target
              </h3>
              <p className="text-2xl font-bold mt-2">
                ₦{totalTarget.toLocaleString()}
              </p>
              <span className="text-sm text-green-600">Expected Payments</span>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-medium text-green-900">
                Amount Paid
              </h3>
              <p className="text-2xl font-bold mt-2">
                ₦{totalAmountPaid.toLocaleString()}
              </p>
              <span className="text-sm text-green-600">Total Received</span>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-medium text-green-900">
                Outstanding Balance
              </h3>
              <p className="text-2xl font-bold mt-2">
                ₦{totalBalance.toLocaleString()}
              </p>
              <span className="text-sm text-green-600">
                Amount Yet to be Paid
              </span>
            </div>
          </div>

          {/* Hospitals and Monthly Remittance Table */}
          {loading ? (
            <p className="text-center text-gray-500">
              Loading Hospitals and Monthly Remittance Table...
            </p>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100 mb-6">
              <h3 className="text-lg font-medium text-green-900 mb-4">
                Hospitals and Monthly Remittance
              </h3>

              {hospitalSummaries.length === 0 ? (
                <p className="text-gray-500">No hospitals found.</p>
              ) : (
                hospitalSummaries.map((hospital) => (
                  <div key={hospital.hospital_name} className="mb-4">
                    <h4 className="text-green-800 font-semibold">
                      {hospital.hospital_name}
                    </h4>
                    <table className="w-full text-sm mt-2 mb-4 table-fixed">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-2 w-1/4">Month</th>
                          <th className="pb-2 w-1/4 text-right">Target</th>
                          <th className="pb-2 w-1/4 text-right">Paid</th>
                          <th className="pb-2 w-1/4 text-right">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(hospital.records || []).map((r, index) => (
                          <tr key={index} className="border-b last:border-0">
                            <td className="py-2">
                              {new Date(r.year, r.month - 1).toLocaleString(
                                "default",
                                { month: "long", year: "numeric" }
                              )}
                            </td>
                            <td className="py-2 text-right">
                              ₦
                              {Number(hospital.monthly_target).toLocaleString()}
                            </td>
                            <td className="py-2 text-right">
                              ₦{Number(r.amount_paid).toLocaleString()}
                            </td>
                            <td
                              className={`py-2 text-right ${
                                r.balance < 0
                                  ? "bg-red-100 text-red-500"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              ₦{Number(r.balance).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MonthlyTarget;

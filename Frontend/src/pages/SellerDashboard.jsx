import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../api";
import { toast } from "react-toastify";

const SellerHome = () => {
  const [stats, setStats] = useState({ bookCount: 0, orderCount: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/seller/stats");
      setStats(response.data.stats);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch stats.");
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: "Books", value: stats.bookCount },
    { name: "Orders", value: stats.orderCount },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-50 to-indigo-100 p-6">
      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">
        Seller Dashboard
      </h1>

      {loading ? (
        <p className="text-center text-lg text-gray-600">Loading stats...</p>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center">
              <span className="text-xl font-medium text-indigo-500">
                📚 Total Books
              </span>
              <span className="text-3xl font-bold text-gray-800 mt-2">
                {stats.bookCount}
              </span>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center">
              <span className="text-xl font-medium text-purple-500">
                🛍 Total Orders
              </span>
              <span className="text-3xl font-bold text-gray-800 mt-2">
                {stats.orderCount}
              </span>
            </div>
          </div>

          {/* Bar Chart Section */}
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
              Activity Overview
            </h2>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="#8b5cf6"
                    radius={[6, 6, 0, 0]}
                    barSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SellerHome;

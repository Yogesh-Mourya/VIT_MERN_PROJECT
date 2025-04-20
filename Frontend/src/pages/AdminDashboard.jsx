import { useEffect, useState } from "react";
import api from "../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    vendors: 0,
    orders: 0,
    books: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/admin/stats");
      setStats(response.data.stats);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch the data.");
      console.error("Error fetching dashboard stats", error);
    }
  };

  const chartData = [
    { name: "Users", value: stats.userCount },
    { name: "Sellers", value: stats.vendorCount },
    { name: "Orders", value: stats.orderCount },
    { name: "Books", value: stats.bookCount },
  ];

  const cardStyles =
    "flex flex-col items-center justify-center bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300";

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8">
        Admin Dashboard
      </h1>

      {/* Summary Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className={cardStyles}>
          <span className="text-indigo-500 text-xl font-semibold">
            👤 Users: {stats.userCount}
          </span>
          <span className="text-3xl font-bold mt-2">{stats.users}</span>
        </div>
        <div className={cardStyles}>
          <span className="text-yellow-500 text-xl font-semibold">
            🛍 Sellers: {stats.vendorCount}
          </span>
          <span className="text-3xl font-bold mt-2">{stats.vendors}</span>
        </div>
        <div className={cardStyles}>
          <span className="text-green-600 text-xl font-semibold">
            📦 Orders: {stats.orderCount}
          </span>
          <span className="text-3xl font-bold mt-2">{stats.orders}</span>
        </div>
        <div className={cardStyles}>
          <span className="text-pink-500 text-xl font-semibold">
            📚 Books: {stats.bookCount}
          </span>
          <span className="text-3xl font-bold mt-2">{stats.books}</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 14 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366F1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;

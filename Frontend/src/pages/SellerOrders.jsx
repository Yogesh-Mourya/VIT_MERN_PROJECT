import { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/order/seller");
      setOrders(response.data.orders);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to load your orders.");
      setError("Failed to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-10 px-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Orders got
      </h1>

      {error && (
        <p className="text-center text-red-600 font-medium mb-4">{error}</p>
      )}

      {loading ? (
        <p className="text-center text-gray-700 text-lg">Loading orders...</p>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  Order ID: {order?._id}
                </h2>
                <p className="text-gray-600">
                  Placed On: {new Date(order?.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Customer Name: {order?.userId?.username || "N/A"}
                </p>
                <p className="text-gray-600">
                  Customer Email: {order?.userId?.email || "N/A"}
                </p>
                <p className="text-gray-600">
                  Status: {order?.status || "N/A"}
                </p>
              </div>

              <div className="divide-y">
                <div className="flex items-center gap-4 p-4">
                  <img
                    src={order.bookId?.imageUrl}
                    alt={order.bookId?.title}
                    className="w-20 h-28 object-contain bg-gray-100 rounded"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-gray-800">
                      {order.bookId?.title}
                    </h3>
                    <p className="text-gray-600">
                      Author: {order.bookId?.author}
                    </p>
                    <p className="text-gray-600">
                      Price: ${order.bookId.price}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-100 text-right">
                <span className="text-gray-800 font-semibold text-lg">
                  Total: ${order?.totalPrice}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg mt-10">
          No orders for your books yet.
        </p>
      )}
    </div>
  );
};

export default SellerOrders;

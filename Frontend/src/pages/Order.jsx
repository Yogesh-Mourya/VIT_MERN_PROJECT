import { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  // For pagination + infinite scroll
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch orders whenever page changes
  useEffect(() => {
    fetchOrders(page);
    // eslint-disable-next-line
  }, [page]);

  const fetchOrders = async (pageNumber) => {
    try {
      setLoading(true);
      // Example: pass `page` to the server to get paginated results
      const response = await api.get("/order/user", {
        params: { page: pageNumber },
      });

      const fetchedOrders = response.data.orders; // or however your API returns it

      // Use the functional form of setOrders to safely access the "previous" orders
      setOrders((prevOrders) => {
        // Filter out any orders that are already in prevOrders
        const newOrders = fetchedOrders.filter(
          (newOrder) => !prevOrders.some((order) => order._id === newOrder._id)
        );

        // If no new orders were returned, we've reached the end
        setHasMore(newOrders.length > 0);

        return [...prevOrders, ...newOrders];
      });

      setError("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to fetch orders.");
      setError(err.response?.data?.error || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll handler
  const handleScroll = () => {
    // Check if the user reached the bottom, we're not already loading, and there's more data
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loading ||
      !hasMore
    ) {
      return;
    }
    // Go to the next page
    setPage((prevPage) => prevPage + 1);
  };

  // Attach/Detach scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-8 px-4">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
        Your Orders
      </h1>

      {error && (
        <p className="text-red-600 text-center font-medium mb-4">{error}</p>
      )}

      {orders.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition duration-300 flex flex-col"
            >
              {order.bookId?.imageUrl && (
                <img
                  src={order.bookId.imageUrl}
                  alt={order.bookId.title}
                  className="w-full max-h-64 object-contain bg-white"
                />
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {order.bookId?.title}
                </h2>
                <p className="text-gray-700 mb-1">
                  <strong>Order ID:</strong> {order._id}
                </p>
                <p className="text-gray-700 mb-1">
                  <strong>Total Price:</strong> ${order.totalPrice}
                </p>
                <p className="text-gray-700 mb-1">
                  <strong>Status:</strong> {order.status}
                </p>
                <p className="text-gray-700">
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : !loading ? (
        <div className="text-center mt-10">
          <p className="text-lg text-gray-600 mb-4">You have no orders.</p>
          <Link
            to="/books"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full transition"
          >
            <p className="text-white">Shop Now</p>
          </Link>
        </div>
      ) : null}

      {/* Show a loading text or spinner while fetching more */}
      {loading && (
        <p className="text-center text-gray-600 mt-4">Loading more orders...</p>
      )}
    </div>
  );
};

export default Orders;

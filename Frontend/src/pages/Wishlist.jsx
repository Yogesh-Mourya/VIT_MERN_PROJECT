import { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await api.get("/user/wishlist");
      setWishlist(response.data.wishlist);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to fetch wishlist.");
      setError(err.response?.data?.error || "Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <h1 className="text-4xl font-bold text-center text-purple-700 mb-8">
          Your Wishlist
        </h1>
        <div className="text-center mt-20">
          <p className="text-lg text-gray-600 mb-4">
            Hold on while we load your wishlish.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-8">
        Your Wishlist
      </h1>

      {error && (
        <p className="text-center text-red-500 font-medium mb-6">{error}</p>
      )}

      {wishlist.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((book) => (
            <Link
              to={`/books/${book._id}`}
              key={book._id}
              className="bg-white shadow-md hover:shadow-xl transition duration-300 rounded-xl overflow-hidden group"
            >
              {book.imageUrl ? (
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="w-full max-h-64 object-contain bg-white group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-1 line-clamp-1">
                  {book.title}
                </h2>
                <p className="text-gray-600 text-sm mb-1">
                  <strong>Author:</strong> {book.author}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  <strong>Genre:</strong> {book.genre}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  <strong>Price:</strong> ${book.price}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  <strong>Stock:</strong>{" "}
                  <span
                    className={
                      book.stock > 0 ? "text-green-600" : "text-red-500"
                    }
                  >
                    {book.stock > 0 ? "Available" : "Out of Stock"}
                  </span>
                </p>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                  {book.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center mt-20">
          <p className="text-lg text-gray-600 mb-4">
            Your wishlist is currently empty.
          </p>
          <Link
            to="/books"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full transition"
          >
            <p className="text-white">Browse Books</p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;

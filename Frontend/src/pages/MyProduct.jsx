import { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";

const MyProducts = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal & Edit form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchVendorBooks();
  }, []);

  const fetchVendorBooks = async () => {
    try {
      const response = await api.get(`/books/my-products`);
      setBooks(response.data.books);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to fetch your books.");
      setError("Failed to fetch your books.");
    }
  };

  const handleDelete = async (bookId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (!confirm) return;

    try {
      setLoading(true);
      await api.delete(`/books/${bookId}`);
      toast.success("Book deleted successfully.");
      setBooks((prev) => prev.filter((book) => book._id !== bookId));
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete books.");
      setError("Failed to delete book.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book) => {
    setSelectedBookId(book._id);
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setPrice(book.price);
    setStock(book.stock);
    setDescription(book.description);
    setImageUrl(book.imageUrl || "");
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/books/${selectedBookId}`, {
        title,
        author,
        genre,
        price,
        stock,
        description,
        imageUrl,
      });

      // Refresh book list after update
      fetchVendorBooks();
      setIsModalOpen(false);
      toast.success("Book details updated successfully.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update books.");
      setError("Failed to update book.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-10 px-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        My Products
      </h1>

      {error && (
        <p className="text-center text-red-600 font-medium mb-4">{error}</p>
      )}

      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition duration-300 flex flex-col"
            >
              {book.imageUrl && (
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="w-full h-64 object-contain p-4 bg-gray-100"
                />
              )}

              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-bold text-gray-800 mb-2">
                  {book.title}
                </h2>
                <p className="text-gray-700 mb-1">
                  <strong>Author:</strong> {book.author}
                </p>
                <p className="text-gray-700 mb-1">
                  <strong>Genre:</strong> {book.genre}
                </p>
                <p className="text-gray-700 mb-1">
                  <strong>Price:</strong> ${book.price}
                </p>
                <p className="text-gray-700 mb-1">
                  <strong>Stock:</strong> {book.stock}
                </p>
                <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                  {book.description}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleEdit(book)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book._id)}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md w-full transition"
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg mt-10">
          You haven&apos;t published any books yet.
        </p>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 px-4 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
              Edit Book
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              <input
                type="text"
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              <input
                type="text"
                placeholder="Genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              <input
                type="number"
                placeholder="Stock Quantity"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 h-24 resize-none"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />

              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white font-medium p-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Update Book
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-300 text-white font-medium p-3 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;

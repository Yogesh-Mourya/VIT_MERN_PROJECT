import { useState, useEffect } from "react";
import api from "../api.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddBook = () => {
  const [userRole, setUserRole] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await api.post("/get-role", { token });
          setUserRole(response.data.role);
        } catch (error) {
          console.error("Error fetching user role:", error);
          toast.error("Something went wrong!");
          setUserRole(null);
        }
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    if (userRole && userRole !== "Vendor") {
      navigate("/");
    }
  }, [userRole, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/books", {
        title,
        author,
        genre,
        price,
        stock,
        description,
        imageUrl,
      });
      const id = response.data.book._id;
      toast.success("Your book was added successfully");

      navigate(`/books/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add book");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 shadow-2xl rounded-xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Add a New Book
        </h2>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full p-3 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Author"
            className="w-full p-3 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Genre"
            className="w-full p-3 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Price"
            className="w-full p-3 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Stock Quantity"
            className="w-full p-3 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full p-3 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            className="w-full p-3 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium p-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api";
import Slider from "react-slick";
import { toast } from "react-toastify";

const BookDetails = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [error, setError] = useState("");
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch book details
  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/books/${bookId}`);
        setBook(response.data.book);
        setError("");
      } catch (err) {
        toast.error(
          err.response?.data?.error || "Failed to fetch book details"
        );
        setError("Failed to fetch book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  // Fetch similar books
  useEffect(() => {
    const fetchSimilarBooks = async () => {
      try {
        if (book?.genre) {
          const response = await api.get("/books", {
            params: { genre: book.genre },
          });
          const filtered = response.data.books.filter((b) => b._id !== bookId);
          setSimilarBooks(filtered);
        }
      } catch (err) {
        toast.error(
          err.response?.data?.error || "Failed to fetch similar books."
        );
        console.error("Failed to fetch similar books", err);
      }
    };

    if (book?.genre) {
      fetchSimilarBooks();
    }
  }, [book, bookId]);

  // Wishlist check
  useEffect(() => {
    const fetchWishlistStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await api.get("/user/wishlist");
        const wishlistBooks = response.data.wishlist || [];
        setIsInWishlist(wishlistBooks.some((b) => b._id === bookId));
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to fetch wishlist.");
        console.error("Failed to fetch wishlist", err);
      }
    };

    fetchWishlistStatus();
  }, [bookId]);

  const handleToggleWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      setLoadingWishlist(true);
      await api.post("/user/wishlist/add-remove", { bookId });
      setIsInWishlist(!isInWishlist);
      if (isInWishlist) toast.success("Removed from wishlist.");
      else toast.success("Added to wishlist.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update wishlist.");
    } finally {
      setLoadingWishlist(false);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: similarBooks.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  if (error) {
    return <p className="text-center text-red-600 mt-10">{error}</p>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="text-center mt-20">
          <p className="text-lg text-gray-600 mb-4">
            Hold on while we load the data for the book.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-10 px-4">
      {book ? (
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <img
              src={book.imageUrl}
              alt={book.title}
              className="w-full md:w-1/2 h-[500px] object-cover rounded-lg shadow"
            />
            <div className="flex flex-col justify-between w-full">
              <div>
                <h1 className="text-4xl font-bold text-indigo-800 mb-4">
                  {book.title}
                </h1>
                <p className="text-gray-700 text-lg mb-1">
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
                <p className="text-gray-600 mt-4">{book.description}</p>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleToggleWishlist}
                  disabled={loadingWishlist}
                  className={`w-full ${
                    loadingWishlist
                      ? "bg-gray-300"
                      : isInWishlist
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-pink-500 hover:bg-pink-600"
                  } text-white py-2 rounded-lg transition duration-200`}
                >
                  {loadingWishlist
                    ? "Updating..."
                    : isInWishlist
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"}
                </button>

                <Link
                  to={`/purchase/${book._id}`}
                  className="w-full text-center bg-green-600 hover:bg-green-700 text-white decoration-0 py-2 rounded-lg transition duration-200"
                >
                  <p className="text-white">Order Now</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center mt-10">Loading book details...</p>
      )}

      {similarBooks.length > 0 && (
        <div className="max-w-6xl mx-auto mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            More in <span className="text-indigo-600">{book.genre}</span>
          </h2>
          <Slider {...sliderSettings}>
            {similarBooks.map((b) => (
              <Link
                key={b._id}
                to={`/books/${b._id}`}
                className="p-2 transition-transform transform hover:scale-105"
              >
                <div className="bg-white rounded-lg shadow overflow-hidden h-[400px] flex flex-col">
                  <img
                    src={b.imageUrl}
                    alt={b.title}
                    className="h-[250px] object-cover w-full"
                  />
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {b.title}
                    </h3>
                    <p className="text-sm text-gray-600">{b.author}</p>
                  </div>
                </div>
              </Link>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default BookDetails;

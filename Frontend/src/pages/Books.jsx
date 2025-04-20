import { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchGenre, setSearchGenre] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // For infinite scroll
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Main fetch function
  const fetchBooks = async (pageNumber, isNewSearch = false) => {
    if (loading) return;

    try {
      setLoading(true);
      const response = await api.get("/books", {
        params: {
          name: searchName,
          genre: searchGenre,
          page: pageNumber,
        },
      });

      const fetchedBooks = response.data.books;

      // If this is a new search, replace all books
      // Otherwise, append to existing books
      setBooks((prevBooks) => {
        if (isNewSearch) {
          return fetchedBooks;
        } else {
          // Filter out duplicates
          const newBooks = fetchedBooks.filter(
            (newBook) => !prevBooks.some((b) => b._id === newBook._id)
          );

          // If no new books came in, there's nothing more to load
          if (newBooks.length === 0) {
            setHasMore(false);
          }

          return [...prevBooks, ...newBooks];
        }
      });

      // Update hasMore based on whether we got fewer books than expected
      // Assumes backend returns a maximum of 10 books per page (adjust as needed)
      if (fetchedBooks.length < 10) {
        setHasMore(false);
      }

      setError("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to fetch books.");
      setError(err.response?.data?.error || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  // Initial load and search changes
  useEffect(() => {
    // Don't trigger on the initial render
    const isInitialRender = page === 1 && books.length === 0;

    if (isInitialRender) {
      fetchBooks(1, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect for page changes
  useEffect(() => {
    // Skip the first page - that's handled by the initial load
    if (page > 1) {
      fetchBooks(page, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Handle the search form
  const handleSearch = (e) => {
    e.preventDefault();
    // Reset book list and page
    setBooks([]);
    setPage(1);
    setHasMore(true);
    // Fetch with the new search parameters
    fetchBooks(1, true);
  };

  // Infinite scroll handler: check if user is near bottom
  const handleScroll = () => {
    if (loading || !hasMore) return;

    // Scroll position
    const scrollTop = document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.offsetHeight;

    console.log(scrollTop, windowHeight, fullHeight);

    // If the user is within 100px of the bottom, load next page
    if (windowHeight + scrollTop >= fullHeight / 2) {
      console.log(page);
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Attach and detach the scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]); // If loading or hasMore changes, re-bind

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-200 py-10 px-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Discover Your Next Read
      </h1>

      {error && (
        <p className="text-red-600 text-center font-medium mb-4">{error}</p>
      )}

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10"
      >
        <input
          type="text"
          placeholder="Search by name"
          className="px-4 py-2 rounded-lg border border-gray-300 w-full max-w-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by genre"
          className="px-4 py-2 rounded-lg border border-gray-300 w-full max-w-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={searchGenre}
          onChange={(e) => setSearchGenre(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
        >
          Search
        </button>
      </form>

      {/* Book List */}
      {books.length === 0 && !loading ? (
        <p className="text-center text-gray-600 text-lg">No books found.</p>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {books.map((book) => (
            <Link
              to={`/books/${book._id}`}
              key={book._id}
              className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition duration-300 max-h-[460px] flex flex-col"
            >
              {book.imageUrl && (
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="w-full h-64 object-contain bg-gray-100"
                />
              )}
              <div className="p-4 flex-1 overflow-hidden flex flex-col justify-between">
                <h2 className="text-lg font-bold text-gray-800 mb-2 truncate">
                  {book.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {book.description || "No description available."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {loading && (
        <p className="text-center text-gray-600 mt-4">Loading more books...</p>
      )}
    </div>
  );
};

export default Books;

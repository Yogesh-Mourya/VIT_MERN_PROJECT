import Book from "../models/bookModel.js";

// Create a new book
export const createBook = async (req, res) => {
  try {
    const { title, author, genre, price, stock, description, imageUrl } =
      req.body;

    const newBook = await Book.create({
      title,
      author,
      genre,
      price,
      stock,
      description,
      imageUrl,
      sellerId: req.user,
    });

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      book: newBook,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get books with optional query parameters for name, genre, and sellerId
export const getBooks = async (req, res) => {
  const { name, genre, sellerId, page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

  const query = {};
  if (name) {
    query.title = { $regex: name, $options: "i" }; // Case-insensitive search for title
  }
  if (genre) {
    query.genre = { $regex: genre, $options: "i" }; // Case-insensitive search for genre
  }
  if (sellerId) {
    query.sellerId = sellerId; // Filter by sellerId
  }

  try {
    const books = await Book.find(query)
      .skip((page - 1) * limit) // Pagination: skip the previous pages
      .limit(Number(limit)); // Limit the number of results

    const totalBooks = await Book.countDocuments(query); // Get total count of books matching the query

    res.status(200).json({
      books,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit), // Calculate total pages
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single book by ID
export const getBookById = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }
    res.status(200).json({ success: true, book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a book by ID
export const updateBook = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res
      .status(200)
      .json({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a book by ID
export const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get books with optional query parameters for name, genre, and sellerId
export const getBooksForSeller = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
  const sellerId = req.user;

  try {
    const books = await Book.find({ sellerId })
      .skip((page - 1) * limit) // Pagination: skip the previous pages
      .limit(Number(limit)); // Limit the number of results

    const totalBooks = await Book.countDocuments(); // Get total count of books matching the query

    res.status(200).json({
      books,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit), // Calculate total pages
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

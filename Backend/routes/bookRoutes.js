import express from "express";
import {
  createBook,
  getBookById,
  getBooks,
  getBooksForSeller,
  updateBook,
  deleteBook,
} from "../controller/bookController.js";
import protect from "../middleware/protect.js";

const router = express.Router();

router.post("/", protect, createBook); // Create a new book
router.get("/", protect, getBooks); // Get all books with optional query parameters
router.get("/my-products", protect, getBooksForSeller); // Get all books based on the provided id in the query
router.get("/:id", protect, getBookById); // Get a single book by ID
router.put("/:id", protect, updateBook); // Update a book by ID
router.delete("/:id", protect, deleteBook); // Delete a book by ID

export default router;

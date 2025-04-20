import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide the book title."],
    },
    author: {
      type: String,
      required: [true, "Please provide the author's name."],
    },
    genre: {
      type: String,
      required: [true, "Please provide the genre."],
    },
    price: {
      type: Number,
      required: [true, "Please provide the price."],
      min: [0, "Price must be a positive number."],
    },
    stock: {
      type: Number,
      required: [true, "Please provide the stock quantity."],
      min: [0, "Stock must be a non-negative number."],
    },
    description: {
      type: String,
      required: [true, "Please provide a description."],
    },
    imageUrl: {
      type: String,
      required: false, // Optional field for book cover image
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please provide the seller ID."],
      ref: "User",
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;

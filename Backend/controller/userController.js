import User from "../models/userModel.js";
import Book from "../models/bookModel.js";
import jwt from "jsonwebtoken";

// Get all users with pagination for infinite loading
export const getAllUsers = async (req, res) => {
  const { username, user, seller, page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

  const query = {};
  if (username) {
    query.username = { $regex: username, $options: "i" };
  }

  if (seller) {
    query.role = "Vendor";
  }
  if (user) {
    query.role = "User";
  }
  try {
    const users = await User.find(query)
      .skip((page - 1) * limit) // Pagination: skip the previous pages
      .limit(Number(limit)); // Limit the number of results

    const totalUsers = await User.countDocuments(query); // Get total count of users

    res.status(200).json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit), // Calculate total pages
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Update a user by ID
export const updateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a book to the wishlist
export const addToWishlist = async (req, res) => {
  const { bookId } = req.body; // Get the book ID from the request body
  const userId = req.user; // Assuming you have user ID from the token

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the book is already in the wishlist
    if (user.wishlist.includes(bookId)) {
      user.wishlist = user.wishlist.filter((book) => book._id != bookId);
    } else {
      user.wishlist.push(bookId); // Add the book ID to the wishlist
    }

    await user.save(); // Save the updated user document

    res.status(200).json({
      success: true,
      message: "Book added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the user's wishlist
export const getWishlist = async (req, res) => {
  const userId = req.user; // Assuming you have user ID from the token

  try {
    const user = await User.findById(userId).populate("wishlist"); // Populate the wishlist with book details
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user profile based on token
export const getUserProfile = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get the token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // Extract user ID from the token

    // Find the user by ID
    const user = await User.findById(userId).select("-password"); // Exclude password from the response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user }); // Return the user profile
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

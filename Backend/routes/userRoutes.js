import express from "express";
import {
  addToWishlist,
  getUserProfile,
  getWishlist,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controller/userController.js";
import protect from "../middleware/protect.js";

const router = express.Router();

router.post("/wishlist/add-remove", protect, addToWishlist); // Route to add a book to the wishlist
router.get("/wishlist", protect, getWishlist); // Route to get the user's wishlist
router.get("/profile", protect, getUserProfile); // Route to get the user's wishlist
router.get("/", protect, getAllUsers); // Route to get all users
router.put("/:id", protect, updateUser); // Route to update a user by ID
router.delete("/:id", protect, deleteUser);

export default router;

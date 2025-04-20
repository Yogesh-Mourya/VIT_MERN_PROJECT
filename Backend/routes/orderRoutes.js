import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  getAllOrdersForUser,
  getAllOrdersForBook,
  getAllOrdersForSeller,
  deleteOrder,
} from "../controller/orderController.js";
import protect from "../middleware/protect.js"; // Middleware to protect routes

const router = express.Router();

router.post("/", protect, createOrder); // Route to create a new order
router.get("/", protect, getAllOrders); // Route to get all orders
router.get("/user", protect, getAllOrdersForUser); // Route to get all orders
router.get("/seller", protect, getAllOrdersForSeller); // Route to get all orders
router.get("/book/:bookId", protect, getAllOrdersForBook); // Route to get all orders
router.get("/:id", protect, getOrderById); // Route to get a specific order by ID
router.put("/:id", protect, updateOrder); // Route to update an order by ID
router.delete("/:id", protect, deleteOrder); // Route to delete an order by ID

export default router;

import Book from "../models/bookModel.js";
import Order from "../models/orderModel.js";

// Create a new order
export const createOrder = async (req, res) => {
  const { bookId } = req.body; // Get sellerId, bookId, and totalPrice from the request body
  const userId = req.user; // Assuming you have user ID from the token

  const book = await Book.findById(bookId);
  if (!book)
    return res
      .status(404)
      .json({ success: false, message: "Could not find the provided book" });

  try {
    const newOrder = await Order.create({
      userId,
      sellerId: book.sellerId,
      bookId,
      totalPrice: book.price,
    });

    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
  try {
    const orders = await Order.find(query)
      .populate("userId sellerId bookId") // Populate user and book details
      .skip((page - 1) * limit) // Pagination: skip the previous pages
      .limit(Number(limit)); // Limit the number of results

    const totalOrders = await Order.countDocuments(query); // Get total count of orders matching the query

    res.status(200).json({
      orders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit), // Calculate total pages
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific order by ID
export const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate("userId sellerId bookId"); // Populate user and book details
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an order by ID
export const updateOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res
      .status(200)
      .json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an order by ID
export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all orders
export const getAllOrdersForSeller = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
  const sellerId = req.user;
  try {
    const orders = await Order.find({ sellerId })
      .populate("userId sellerId bookId") // Populate user and book details
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .skip((page - 1) * limit) // Pagination: skip the previous pages
      .limit(Number(limit)); // Limit the number of results

    const totalOrders = await Order.countDocuments({ sellerId }); // Get total count of orders matching the query

    res.status(200).json({
      orders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit), // Calculate total pages
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllOrdersForUser = async (req, res) => {
  const { page = 1, limit = 9 } = req.query; // Default to page 1 and limit 10
  const userId = req.user;
  try {
    const orders = await Order.find({ userId })
      .populate("userId sellerId bookId") // Populate user and book details
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .skip((page - 1) * limit) // Pagination: skip the previous pages
      .limit(Number(limit)); // Limit the number of results

    const totalOrders = await Order.countDocuments({ userId }); // Get total count of orders matching the query

    res.status(200).json({
      orders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit), // Calculate total pages
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllOrdersForBook = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
  const { bookId } = req.params;
  try {
    const orders = await Order.find({ bookId })
      .populate("userId sellerId bookId") // Populate user and book details
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .skip((page - 1) * limit) // Pagination: skip the previous pages
      .limit(Number(limit)); // Limit the number of results

    const totalOrders = await Order.countDocuments({ bookId }); // Get total count of orders matching the query

    res.status(200).json({
      orders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit), // Calculate total pages
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

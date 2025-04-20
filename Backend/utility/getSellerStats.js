import Book from "../models/bookModel.js";
import Order from "../models/orderModel.js";

const getSellerStats = async (req, res, next) => {
  const sellerId = req.user;
  try {
    // Count the number of books published by the seller
    const bookCount = await Book.countDocuments({ sellerId });

    // Count the number of orders received by the seller
    const orderCount = await Order.countDocuments({ sellerId });

    return res.status(200).json({
      success: true,
      stats: {
        bookCount,
        orderCount,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
      message: "Failed to fetch the stats for the user.",
    });
  }
};

export default getSellerStats;

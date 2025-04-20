import Book from "../models/bookModel.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

const getAdminStats = async (req, res, next) => {
  try {
    const vendorCount = await User.countDocuments({ role: "Vendor" });

    const userCount = await User.countDocuments({ role: "User" });

    const orderCount = await Order.countDocuments();

    const bookCount = await Book.countDocuments();

    return res.status(200).json({
      success: true,
      stats: {
        vendorCount,
        userCount,
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

export default getAdminStats;

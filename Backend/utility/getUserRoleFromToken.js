import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; // Import the User model

const getUserRoleFromToken = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or missing token." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "No user found with the token." });

    return res.status(200).json({ success: true, role: user.role });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

export default getUserRoleFromToken;

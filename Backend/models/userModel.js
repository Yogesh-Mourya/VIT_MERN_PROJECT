import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide your username."],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide your valid email address."],
  },
  password: {
    type: String,
    required: [true, "Please provide a password."],
  },
  wishlist: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Book",
    },
  ],
  role: {
    type: String,
    enum: ["User", "Vendor", "Admin"],
    default: "User",
  },
});

const User = mongoose.model("User", userSchema);

export default User;

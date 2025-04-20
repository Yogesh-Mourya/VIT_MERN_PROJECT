// server/routes/order.js
import express from "express";
import {
  handlePayment,
  verifyPayment,
} from "../controller/paymentController.js";

const router = express.Router();

// create-razorpay-order endpoint
router.post("/create-razorpay-order", handlePayment);

// routes/paymentRoutes.js
router.post("/verify-razorpay-signature", verifyPayment);

export default router;

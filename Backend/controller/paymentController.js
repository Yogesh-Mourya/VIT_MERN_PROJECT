import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

// Initialize Razorpay instance with your credentials
const razorpayInstance = new Razorpay({
  key_id: process.env.RP_KEY_ID,
  key_secret: process.env.RP_KEY_SECRET,
});

export const handlePayment = async (req, res) => {
  try {
    const { amount } = req.body; // e.g. 500 in paise => 50000 for Rs.500
    // Or you might fetch the book's price from your DB and convert to paise

    const options = {
      amount: amount * 100, // in paise (multiply amount in rupees by 100)
      currency: "INR",
      receipt: "receipt#1", // can be any unique value
      payment_capture: 1, // auto-capture
    };

    const order = await razorpayInstance.orders.create(options);

    // The order object will have an id property, which is your order_id
    return res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      // you can pass other data if needed
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    // Step 1: Create the expected signature
    const bodyString = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RP_KEY_SECRET)
      .update(bodyString)
      .digest("hex");

    // Step 2: Compare signatures
    if (expectedSignature === signature) {
      // Payment is legit: fulfill the order in your DB
      // e.g. Mark order as paid
      // await Order.findOneAndUpdate({ orderId }, { status: 'PAID', paymentId });

      return res
        .status(200)
        .json({ success: true, message: "Payment verified successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error verifying payment" });
  }
};

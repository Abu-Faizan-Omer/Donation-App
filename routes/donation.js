const express = require("express");
const router = express.Router();
const razorpay = require("../utils/razorpay");
const donationController = require("../controllers/donation");
const authentications=require("../middleware/auth")


// Create Razorpay Order
router.post("/create-order", async (req, res) => {
    try {
        const { amount } = req.body; // Amount in paise (e.g., 1000 = ₹10)

        const options = {
            amount: amount * 100, // Convert to paise
            currency: "INR",
            receipt: "order_receipt", // Unique receipt ID
        };

        const order = await razorpay.orders.create(options);  //isse ek orderId milti hai
        res.status(200).json({ order });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ message: "Error creating order" });
    }
});

// Get Razorpay Key
router.get("/get-key", (req, res) => {
    try {
        res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
    } catch (error) {
        console.error("Error fetching Razorpay key:", error);
        res.status(500).json({ message: "Error fetching Razorpay key" });
    }
});

// Route to save donation record after successful payment
router.post("/save-donation",authentications.authenticate, donationController.saveDonation);

module.exports = router;
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // Razorpay key_id
    key_secret: process.env.RAZORPAY_KEY_SECRET, // Razorpay key_secret
});

module.exports = razorpay;
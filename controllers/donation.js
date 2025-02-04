const Donation = require("../models/donation");

// Save Donation Record
exports.saveDonation = async (req, res) => {
    try {
        const { donationAmount, paymentId, status, userId, charityId } = req.body;

        // Save donation record in the database
        const donation = await Donation.create({
            amount: donationAmount,
            status: status,
            paymentId: paymentId,
            userId: userId,
            charityId: charityId,
        });

        console.log("Donation saved successfully:", donation);
        res.status(200).json({ message: "Donation recorded successfully", donation });
    } catch (error) {
        console.error("Error saving donation:", error);
        res.status(500).json({ message: "Error processing donation" });
    }
};
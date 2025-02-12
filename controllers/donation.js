const Donation = require("../models/donation");
const User=require("../models/user")
const sendEmail = require("../services/email")
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

          // Fetch user email to send confirmation
          const userIdd = req.user.id; 
          console.log("userIdd ",userIdd)
    const user = await User.findOne({where:{id:userIdd}});
    console.log("user.email== ",user.email)

    // Send email confirmation to the donor
    await sendEmail(
      user.email,
      'Donation Confirmation',
      `<h1>Thank you for your donation of ₹${donationAmount} to the charity "${charityId}".</h1>`
    );

        res.status(200).json({ message: "Donation recorded successfully", donation });
    } catch (error) {
        console.error("Error saving donation:", error);
        res.status(500).json({ message: "Error processing donation" });
    }
};
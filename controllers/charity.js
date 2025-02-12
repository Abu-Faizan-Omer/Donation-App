const Charity = require("../models/charity");
const User=require("../models/user")
const sequelize=require("sequelize")

const sendEmail = require('../services/email');

// Charity Registration
exports.registerCharity = async (req, res) => {
  try {
    const { name, email, mission, category, location, totalAmount,donationGoal } = req.body;
    console.log("name",req.body.name)

    // Check if charity already exists
    let charity = await Charity.findOne({ where: { email } });
    if (charity) return res.status(400).json({ message: "Charity already registered" });
    console.log("charity",charity)

    // Create new charity (default: not approved)
    charity = await Charity.create({ name, email, mission, category, location, totalAmount,donationGoal ,isapprove: false});
    console.log("Created",charity)

    return res.status(201).json({ message: "Charity registered successfully. Waiting for admin approval.", charity });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

//Get All UnApprove Charity
exports.getUnapproveCharities=async (req,res)=>{
  try{
    const userId = req.user.id; // Get the user ID from the request (from token)
    console.log("userID---",userId)
    //check it is admin or not
    const user = await User.findOne({ where: { id: userId, isAdmin: true } });
    if (!user) return res.status(403).json({ message: "Not authorized. Admins only." });


    const allCharity=await Charity.findAll({where:{isapprove:false}})
    return res.status(201).json({message:"Get all unaprove chaity",allCharity})//allcharity response me jata hai frontend ke pass
  }catch(err)
  {
    console.log("Error to find Unapprove Charity",err)
    return res.status(500).json({message:"Error in finding UnApprove charity"})
  }
}



// Admin - Approve Charity
exports.approveCharity = async (req, res) => {
  try {
    const { id } = req.params;

    let charity = await Charity.findByPk(id);
    if (!charity) return res.status(404).json({ message: "Charity not found" });

    charity.isapprove = true;
    await charity.save();

    // Send email to the charity about approval
    await sendEmail(
      charity.email,
      'Your Charity Has Been Approved!',
      `<h1>Your charity "${charity.name}" has been successfully approved by the admin.</h1>`
    );

    return res.json({ message: "Charity approved successfully", charity });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Reject a Charity
exports.rejectCharity = async (req, res) => {
  try {
      const { id } = req.params;
      const charity = await Charity.findByPk(id);

      if (!charity) {
          return res.status(404).json({ message: "Charity not found" });
      }

      await charity.destroy(); // Delete the charity from the database

       // Send email to the charity about rejection
    await sendEmail(
      charity.email,
      'Your Charity Has Been Rejected',
      `<h1>We regret to inform you that your charity "${charity.name}" has been rejected.</h1>`
    );

      return res.status(200).json({ message: "Charity rejected successfully" });
  } catch (error) {
      return res.status(500).json({ message: "Server error", error });
  }
};

// Get All Approved Charities
exports.getCharities = async (req, res) => {
  try {
    const allcharities = await Charity.findAll({ where: { isapprove: true } });
    return res.status(200).json({message:"Get all approve charity",allcharities});
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};


// Get Charity Details by ID
exports.getCharityById = async (req, res) => {
  try {
    const { id } = req.params;
    const charity = await Charity.findByPk(id);
    console.log("charity",charity)
    if (!charity) {
      return res.status(404).json({ message: "Charity not found-" });
    }
    return res.status(200).json({ message:charity });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// In charityController.js
exports.donateToCharity = async (req, res) => {
  console.log("hiii")
  try {
    const { id } = req.params; // Get the charity ID from the URL
    console.log("req.param.id",req.params.id)
    const { donationAmount } = req.body; // Donation amount from the request body

   
    // Find the charity by ID
    let charity = await Charity.findByPk(id);
    console.log('charity>>>>>>>>>',charity)
    if (!charity) {
      return res.status(404).json({ message: "Charity not found!" });
    }

    // Check if donation exceeds the goal
    if (parseInt(charity.totalAmount) + parseInt(donationAmount) > charity.donationGoal) {
      return res.status(400).json({ message: "Donation exceeds the goal limit!" });
    }

    // specifically Update the total amount donated cololumn only
    charity.totalAmount = parseInt(charity.totalAmount) + parseInt(donationAmount);
    await charity.save();

    return res.status(200).json({ message: "Donation successful", charity });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};


// Filter Charities by Location and Category
exports.filterCharities = async (req, res) => {
  console.log("this is filter ")
  try {
      const { location, category } = req.query;

      // Build the filter object
      const filter = { isapprove: true }; // Only show approved charities
      if (location) filter.location = location;
      if (category) filter.category = category;

      console.log("location= ",req.query.location)

      // Find charities based on the filter
      const charities = await Charity.findAll({ where: filter });

      if (charities.length === 0) {
          return res.status(404).json({ message: "No charities found for the given criteria." });
      }

      return res.status(200).json({ message: "Filtered charities", charities });
  } catch (error) {
      return res.status(500).json({ message: "Server error", error });
  }
};
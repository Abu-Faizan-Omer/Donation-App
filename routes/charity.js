const express=require("express")
const router=express.Router()

const charityController=require("../controllers/charity")
const authentication=require("../middleware/auth")

router.post("/register",charityController.registerCharity)
router.get("/getcharity",charityController.getCharities)
router.put("/approve/:id",charityController.approveCharity)
router.get("/unapprove",charityController.getUnapproveCharities)
// Reject a charity
router.delete("/reject/:id", charityController.rejectCharity);

// Get Charity Details by ID
router.get("/:id", charityController.getCharityById);

// Add a donation route in your routes file
router.patch("/donate/:id", charityController.donateToCharity);


module.exports=router
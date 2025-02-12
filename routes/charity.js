const express=require("express")
const router=express.Router()

const charityController=require("../controllers/charity")
const authenticateMiddleware=require("../middleware/auth")

router.post("/register",charityController.registerCharity)

//fetch all approve charity 44
router.get("/getcharity",charityController.getCharities)

//approve charity  222
router.put("/approve/:id",charityController.approveCharity)

//list of all unapprove charity   111
router.get("/unapprove",authenticateMiddleware.authenticate,charityController.getUnapproveCharities)

// Reject a charity 33
router.delete("/reject/:id", charityController.rejectCharity);

// Filter Charities by Location and Category
router.get("/filter", charityController.filterCharities);

// Get Charity Details by ID 55
router.get("/:id", charityController.getCharityById);

// Add a donation route in your routes file 66
router.patch("/donate/:id", charityController.donateToCharity);




module.exports=router
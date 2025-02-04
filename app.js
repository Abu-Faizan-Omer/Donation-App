const dotenv=require("dotenv").config()
const express=require("express")
const app=express()
const cors=require("cors")
const bodyparser = require("body-parser")
const path=require("path")
const sequelize=require("./utils/database")


//path
const currentDirectory=path.join(__dirname,"public")

//routes
const userRoutes=require("./routes/user")
const charityRoutes=require("./routes/charity")
const donationRotes=require("./routes/donation")

//table
const User=require("./models/user")
const Charity=require("./models/charity")
const Donation=require("./models/donation")

//middleware
app.use(cors())
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use(express.static(currentDirectory))

app.use("/user",userRoutes)
app.use("/charity",charityRoutes)
app.use("/donation",donationRotes)

// Relationships
User.hasMany(Donation);
Donation.belongsTo(User);

Charity.hasMany(Donation);
Donation.belongsTo(Charity);


sequelize.sync()
.then((result)=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is runnig on PORT  ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("Error in synching",err)
})

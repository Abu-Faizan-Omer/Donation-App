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
app.use(express.static(path.join(__dirname, 'public')))



app.use("/user",userRoutes)
app.use("/charity",charityRoutes)
app.use("/donation",donationRotes)

////------------------------------------------------------------------------------
// app.get("/",(req,res,next)=>{
//     res.sendFile(path.join(__dirname,"views", "home.html"))
// })

// app.get("/signup",(req,res,next)=>{
//     res.sendFile(path.join(__dirname,"views", "signup.html"))
// })
// app.get("/login",(req,res,next)=>{
//     res.sendFile(path.join(__dirname,"views", "login.html"))
// })
// app.get("/register",(req,res,next)=>{
//     res.sendFile(path.join(__dirname,"views", "register.html"))
// })
// app.get("/donation",(req,res,next)=>{
//     res.sendFile(path.join(__dirname,"views", "donation.html"))
// })

// app.get("/charity",(req,res,next)=>{
//     res.sendFile(path.join(__dirname,"views", "charity.html"))
// })

// app.get("/admin",(req,res,next)=>{
//     res.sendFile(path.join(__dirname,"views", "admin.html"))
// })
// app.get("/test",(req,res,next)=>{
//     res.sendFile(path.join(__dirname,"views", "test.html"))
// })
////----------------------------------------------------------------------------------

// Serve home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));  // Home page is home.html
});

// Serve HTML files dynamically from /views folder
app.get("/:page", (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, 'views', `${page}.html`), (err) => {
        if (err) {
            res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
        }
    });
});



// app.get("*",(req,res)=>{
//     const requestUrl=req.url
//     console.log('requestUrl ',requestUrl)
//     console.log("dirname ",__dirname)
//     if(requestUrl.startsWith('/views'))
//     {
//         res.sendFile(path.join(__dirname,requestUrl))
//     }else{
//         res.sendFile(path.join(__dirname,"public",requestUrl))
//     }
// })

// Relationships
User.hasMany(Donation);
Donation.belongsTo(User);

Charity.hasMany(Donation);
Donation.belongsTo(Charity);

console.log("Serving static files from:", currentDirectory);

sequelize.sync()
.then((result)=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is runnig on PORT  ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("Error in synching",err)
})

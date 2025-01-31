const User=require("../models/user")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

exports.signup=async(req,res)=>{
    try{
        const { name, email, password, adminEmail } = req.body;

        console.log("NAME",name,email,password)
        // Check if user already exists
        const finduser=await User.findAll({where:{email}})
        if(finduser.length > 0)
        {
            return res.status(400).json({message:"User already exist in DB"})
        }
        //use bcrypt for password hashing
        const saltround=10
        const hash=await bcrypt.hash(password,saltround)

         // Check if adminEmail matches
         const isAdmin = adminEmail === "admin@example.com"; // Replace with your admin email

        const newUser=await User.create({name,email,password:hash,isAdmin})
        return res.status(201).json({message:"User create Succesfully in DB"})
        
    }catch(err)
    {
        console.log("Error during signup:", err)
        return res.status(500).json({message:"Failed to create DB"})
    }
}

function generateAccesToken(id,name){
    return jwt.sign({userId:id,name:name},process.env.TOKEN_SECRET)
}

exports.generateAccesToken=generateAccesToken

exports.login = async (req, res) => {
    try {
        const { email, password, adminEmail } = req.body;
        console.log("email", email);

        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Check if adminEmail matches and user is admin
        if (adminEmail === "admin@example.com" && user.isAdmin) {
            const token = generateAccesToken(user.id, user.name);
            return res.status(200).json({
                message: "Admin login successful",
                token,
                isAdmin: true,
            });
        } else if (adminEmail === "") {
            const token = generateAccesToken(user.id, user.name);
            return res.status(200).json({
                message: "User login successful",
                token,
                isAdmin: false,
            });
        } else {
            return res.status(401).json({ message: "Invalid admin email" });
        }
    } catch (err) {
        console.log("Error in login:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
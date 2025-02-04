const jwt=require("jsonwebtoken")
const User=require("../models/user")

const authenticate=(req,res,next)=>{
    const token=req.headers("Authorization")
    console.log("token ",token)
    if(!token)
    {
        throw new Error("Token not found")
    }
    try{
        const user=jwt.verify(token,process.env.TOKEN_SECRET) // decrypting and find user
        console.log("user>>> ",user.userId)

        User.findByPk(user.userId).then(user =>{

            req.user=user //req is global so i m telling to next function i have that user
            next()
        })

    }catch(err)
    {
        console.log("token not found",err)
        return res.status(400).json({success:false})
    }
}

module.exports=authenticate
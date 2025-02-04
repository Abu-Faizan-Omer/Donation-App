const Sequalize=require("sequelize")
const sequalize=require("../utils/database")

const Donation=sequalize.define("donation",{
    id:{
        type:Sequalize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    amount:{
        type:Sequalize.INTEGER,
        allowNull:false,
    },
    status:{
        type:Sequalize.STRING,
        allowNull:false
    },
    paymentId:{
        type:Sequalize.STRING,
        allowNull:false
    }
})
module.exports=Donation
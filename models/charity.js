const sequalize=require("../utils/database")
const Sequalize=require("sequelize")

const Charity=sequalize.define("charity",{
    id:{
        type:Sequalize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:Sequalize.STRING,
        allowNull:false
    },
    email:{
        type:Sequalize.STRING,
        allowNull:false,
        unique:true
    },
    mission:{
        type:Sequalize.STRING,
        allowNull:false
    },
    category: {
        type: Sequalize.STRING,
        allowNull: false,
      },
    location:{
        type:Sequalize.STRING,
        allowNull:false
    },
    totalAmount:{
        type:Sequalize.INTEGER,
        allowNull:false
    },
    donationGoal:{
        type:Sequalize.INTEGER,
        allowNull:false
    },
    isapprove:{
        type:Sequalize.STRING,
        allowNull:false
    }
})
module.exports=Charity
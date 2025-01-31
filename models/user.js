const { type } = require("os")
const sequelize=require("../utils/database")
const Sequalize=require("sequelize")

const User=sequelize.define("user",{
    id:{
        type:Sequalize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:Sequalize.STRING,
        allowNull:false,
    },
    email:{
        type:Sequalize.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:Sequalize.STRING,
        allowNull:false,
    },
    isAdmin:{
        type:Sequalize.STRING,
        defaultValue: false,
    }
})

module.exports=User
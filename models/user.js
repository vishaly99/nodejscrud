const { name } = require('ejs');
const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    created:{
        type:String,
        required:true,
        default:Date.now
    }
});


const User=new mongoose.model("User",userSchema);
module.exports=User;
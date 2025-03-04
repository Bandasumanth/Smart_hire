let mongoose=require("mongoose")
let usch=new mongoose.Schema({
    "_id":String,
    "firstName":String,
    "lastName":String,
    "phno":String,
    "pwd":String,
    "role":{
        type:String,
        default:"user"
    }
})
let um=mongoose.model("Userdetails",usch)
module.exports=um
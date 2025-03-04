const mongoose = require("mongoose");

const ApplySchema = new mongoose.Schema({
    "_id": String,
    "jobid":String,
    "role":String,
    "adminid":String,
    "userid": String,
    "fullname":String,
    "phno":String,
    'companyname':String,
    "resume":String
    
    
});

const ApplyModel = mongoose.model("ApplyDetails", ApplySchema);
module.exports = ApplyModel;
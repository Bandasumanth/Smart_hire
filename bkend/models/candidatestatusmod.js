let mongoose = require("mongoose")
let candidatesch = new mongoose.Schema({
    "_id":String,
    "jobid":String,
    "adminid":String,
    "userid":String,
    "role":String,
    "status":String
})
let finalmodel = mongoose.model("FinalStatus",candidatesch)
module.exports = finalmodel
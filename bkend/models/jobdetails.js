const mongoose = require("mongoose");


const jobSchema = new mongoose.Schema({
    "_id": String,
    "userid": String,
    "role": String,
    "type":String,
    "exp": String,
    "companyname": String,
    "sal": String,
    "companyoverview":String,
    "joboverview": String,
    "keyresponsibilities": [String],
    "requiredskills": [String],
    "skills": [String],
    "worklocation": String,
    "companylocation": String,
    "shortdesc": String
});

const JobModel = mongoose.model("JobDetails", jobSchema);
module.exports = JobModel;

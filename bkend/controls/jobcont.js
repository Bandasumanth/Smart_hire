let JobModel = require("../models/jobdetails")
const { v4: uuidv4 } = require("uuid");

let addjob = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ msg: "Invalid request body" });
        }
        let data = new JobModel({ ...req.body, _id: uuidv4() });
        await data.save();
        res.json({ msg: "Details Added" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: "Error in Adding", error: e.message });
    }
};

let jobdetails = async(req,res)=>{
    try{
        let data = await JobModel.find()
        res.json(data)

    }
    catch(e)
    {
        res.json({"msg":"Error in Fetching"})
    }
}

let getuserjob = async(req,res)=>{
    try{
        let data = await JobModel.find({"userid":req.params.userid})
        res.json(data)
    }
    catch(e){
        res.json({"msg":"Error in Fetching"})
    }
}

let getbyid = async(req,res)=>{
    try{
        let data = await JobModel.findById({"_id":req.params.id})
        res.json(data)
    }
    catch(e){
        res.json({"msg":"Error in Fetching"})
    }
}


const delbyid = async (req, res) => {
    try {
        let data = await JobModel.findByIdAndDelete(req.params.id);

        if (!data) {
            return res.json({ msg: "Job not found" });
        }

        res.json({ msg: "Job deleted successfully"});
    } catch (e) {
        res.json({ msg: "Error in Server" });
    }
};



const editbyid = async (req, res) => {
    try {
        let data = await JobModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!data) {
            return res.json({ msg: "Job not found" });
        }

        res.json({ msg: "Job updated successfully", updatedJob: data });
    } catch (e) {
        res.json({ msg: "Error in Server", error: e.message });
    }
};



module.exports = {addjob,getuserjob,jobdetails,getbyid,delbyid,editbyid}
const multer = require("multer");
const { v4 } = require("uuid");
const ApplyModel = require("../models/Apply");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './Resume')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix+"."+file.mimetype.split("/")[1])
    }
  })
  
  const upload = multer({ storage: storage })




let Apply=async(req,res)=>{
    try{
        let f = await ApplyModel.find({"jobid":req.body.jobid,"userid":req.body.userid})
        if(f.length>0)
        {
            res.json({"msg":"Already Applied for this Role.."})
        }
        else
        {
            let data=new ApplyModel({...req.body,"resume":req.file.filename,"_id":v4()})
            await data.save()
            res.json({"msg":"Job Applied.."})
        }

    }
    catch(e)
    {   console.log(e)
        res.json({"msg":"Error in the Applying.."})
    }
}

let isapplied = async(req,res)=>{
  try{
    let data = await ApplyModel.find()
    res.json(data)
  }
  catch(e)
  {
    res.json({"msg":"Error in fetching"})
  }
}


let appliedgetuserid = async(req,res)=>{
  try{
    let data = await ApplyModel.find({"adminid":req.params.id})
    res.json(data)
  }
  catch(e)
  {
    res.json({"msg":"Error in Fetching Details"})
  }
}


let appliedgetbyjobid = async(req,res)=>{
  try{
    let data = await ApplyModel.find({"jobid":req.params.id})
    res.json(data)
  }
  catch(e)
  {
    res.json({"msg":"Error in Fetching Details"})
  }
}

let deldetails = async(req,res)=>{
  try{
      let data = await ApplyModel.findByIdAndDelete(req.params.id)
      if(!data)
      {
          return res.json({ msg: "Job not found" });
      }
      res.json({ msg: "Job deleted successfully"});
  }
  catch(e)
  {
      res.json({ msg: "Error in Server" });
  }

}


module.exports = { upload, Apply, isapplied, appliedgetuserid,appliedgetbyjobid,deldetails};

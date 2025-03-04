let express=require("express")
const { Apply, upload, isapplied, appliedgetuserid, appliedgetbyjobid, deldetails } = require("../controls/jobapply")
let applyroute=new express.Router()

applyroute.post("/applyjob",upload.single("resume"),Apply)
applyroute.get("/getbyapplied",isapplied)
applyroute.get("/appliedgetuserid/:id",appliedgetuserid)
applyroute.get("/getbyjobid/:id",appliedgetbyjobid)

module.exports = applyroute
let express=require("express")
const { statusupdate, getstatus } = require("../controls/candidatestatuscont")
const { deldetails } = require("../controls/jobapply")

let statusroute=new express.Router()
statusroute.post("/statusupdate",statusupdate)
statusroute.get("/getstatus/:id",getstatus)
module.exports=statusroute
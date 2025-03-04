let express=require("express")
const { addjob, jobdetails, getuserjob, delbyid, editbyid, getbyid } = require("../controls/jobcont")
let jobrout=new express.Router()

jobrout.post("/addjob",addjob)
jobrout.get("/jobdetails",jobdetails)
jobrout.get("/getuserjob/:userid",getuserjob)
jobrout.delete("/del/:id",delbyid)
jobrout.put("/edit/:id",editbyid)
jobrout.get("/getbyid/:id",getbyid)


module.exports=jobrout
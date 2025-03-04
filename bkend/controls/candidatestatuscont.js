let {v4}= require("uuid")
const finalmodel = require("../models/candidatestatusmod")

let statusupdate = async(req,res)=>{
    try{
        let data = new finalmodel({...req.body, "_id":v4()})
        await data.save()
        res.json({"msg":"StatusUpdated.."})
    }
    catch(e)
    {
        res.json({"msg":"Sever error try again later.."})
    }
}

let getstatus = async(req,res)=>{
    try{
        let data = await finalmodel.find({"adminid":req.params.id})
        res.json(data)

    }
    catch(e)
    {
        res.json({"msg":"error in fetching the detials.."})
    }
}




module.exports = {statusupdate, getstatus}
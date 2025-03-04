let bcrypt=require("bcrypt")
let jwt=require("jsonwebtoken")
const um = require("../models/user")

let reg=async(req,res)=>{
    try{
        let obj=await um.findById({"_id":req.body._id})
        if(obj)
        {
            res.json({"msg":"Email Already Exist!.."})
        }
        else{
            let hashcode= await bcrypt.hash(req.body.pwd,10)
            let data=new um({...req.body,"pwd":hashcode})
            await data.save()
            res.json({"msg":"Registration Done"})
        }
    }
    catch(err)
    {   console.log(err)
        res.json({"msg":"Error in Registration. Try Again later"})
    }
}
let login=async(req,res)=>{
    try{
        let obj=await um.findById({"_id":req.body._id})
        if(obj)
        {
            let f=await bcrypt.compare(req.body.pwd,obj.pwd)
            if(f)
            {
                res.json({"token":jwt.sign({"_id":obj._id},"abcd"),"_id":obj._id,"firstName":obj.firstName,"lastName":obj.lastName,"role":obj.role,"phno":obj.phno})
            }
            else{
                res.json({"msg":"Password is Wrong!.."})
            }
        

        }
        else{
            res.json({"msg":"Enter Correct Email-id"})
        }

    }
    catch(err)
    {
        res.json({"msg":"Error in login. Try Again Later"})
    }
}


let pwdreset = async (req, res) => {
    try {
        let { email, newPassword } = req.body;

        // Check if the user exists
        let user = await um.findOne({"_id":email });
        if (!user) {
            return res.json({ msg: "User not found" });
        }

        // Hash the new password
        let hashcode = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        await um.updateOne({"_id": email }, { $set: { pwd: hashcode } });
        res.json({ msg: "Password Reset Successfully" });
    } catch (e) {
        console.error(e);
        res.json({ msg: "Error in Resetting Password. Try Again Later" });
    }
};
module.exports={reg,login,pwdreset}
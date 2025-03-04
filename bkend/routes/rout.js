let express=require("express")
let {reg, login, pwdreset} = require("../controls/cont")

let route=new express.Router()
route.post("/reg",reg)
route.post("/login",login)
route.post("/reset-password",pwdreset)
module.exports=route
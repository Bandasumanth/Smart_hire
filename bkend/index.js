let express = require("express")
let mongoose = require("mongoose")
let cors = require("cors")
const route = require("./routes/rout")
const jobrout = require("./routes/jobrout")
let bodyParser = require("body-parser")
const applyroute = require("./routes/Applyrout")
const statusroute = require("./routes/Candidatestatusrout")
const dotenv = require('dotenv');
let mailRoutes = require("./routes/mailRoutes")



mongoose.connect("mongodb://127.0.0.1:27017/Ecomdata").then(() => {
    console.log("ok")
})
dotenv.config();
let app = express()
app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ "extended": true }))
app.use("/resume", express.static("./Resume"))
app.use('/api/mail', mailRoutes);
app.use("/", route)
app.use("/", jobrout)
app.use("/", applyroute)
app.use("/", statusroute)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
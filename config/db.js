const mongoose = require("mongoose")
require("dotenv").config()
const connectDB = () => {
    mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log("Connected")
    })
    .catch((e)=>{
        console.log(e)
    })
}

module.exports = connectDB
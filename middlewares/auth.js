const jwt = require("jsonwebtoken")
require("dotenv").config()
const auth = (req,res,next) =>{
    const authHeaders = req.headers.authorization
    
    if(!authHeaders || !authHeaders.startsWith("Bearer")){
        return res.status(404).json({
            msg : "Token not found"
        })
    }
    let token = authHeaders.split(' ')[1]
    
    try{
        let decoded = jwt.verify(token,process.env.SECRET)
        
        req.userID = decoded.userId
        next()
    }catch(e){
        return res.status(404).json({
            msg : "Invalid Token"
        })
    }
}

module.exports = auth
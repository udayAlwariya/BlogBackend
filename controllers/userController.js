const { signupSchema,signinSchema } = require("../config/zod")
const commentModel = require("../models/comments")
const postModel = require("../models/post")
const userModel = require("../models/user")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const signup = async (req,res) =>{
    const {firstName,lastName,email,password} = req.body
    let response = signupSchema.safeParse({firstName,lastName,email,password})
    if(!response.success){
        return res.status(400).json({
            msg : "Invalid inputs"
        })
    }
    let userExists = await userModel.findOne({email:email})
    if(userExists){
        return res.status(404).json({
            msg : "User already exists"
        })
    }
    let user = await userModel.create({
        firstName,lastName,email,password
    })
    
    let payload = {
        userId : user._id
    }
    let token =  jwt.sign(payload,process.env.SECRET)
    
    res.status(200).json({
        token : token
    })
}

const signin = async (req,res)=>{
    const {email,password} = req.body
    let response = signinSchema.safeParse({email,password})
    if(response.success == true){
        let userExist = await userModel.findOne({email:email,password:password})
        if(userExist){
            let payload = {
                userId : userExist._id
            }
            let token = jwt.sign(payload,process.env.SECRET)
            return res.status(200).json({
                token : token
            })
        }else{
            return res.status(404).json({
                msg : "User doesnt exist"
            })
        }
    }else{
        return res.status(400).json({
            msg : "Invalid inputs"
        })
    }

}

const updateUser = async(req,res)=>{
    const {firstName,lastName,email,password} = req.body
    const update = {}
    if (req.body.firstName) update.firstName = req.body.firstName
    if (req.body.lastName) update.lastName = req.body.lastName
    if (req.body.email) update.email = req.body.email
    if (req.body.password) update.password = req.body.password
    const userID = req.userID
    const updatedUser = await userModel.findOneAndUpdate({_id : userID},update,{new:true})
    if(req.body.firstName){
        const updatePost = await postModel.updateMany({userId : userID},{
            username : firstName
        })
        const updateComment = await commentModel.updateMany({userId:userID},{
            username : firstName
        })
    }
  
    res.status(200).json({
        msg : updatedUser
    })

}

const authentication = (req,res) =>{
    const authHeaders = req.headers.authorization
    
    if(!authHeaders || !authHeaders.startsWith("Bearer")){
        return res.status(404).json({
            msg : "Token not found"
        })
    }
    let token = authHeaders.split(' ')[1]
    
    try{
        let decoded = jwt.verify(token,process.env.SECRET)
        
        res.status(200).json({
            msg : "Verified"
        })
    }catch(e){
        return res.status(404).json({
            msg : "Invalid Token"
        })
    }
}

module.exports = {signup,signin,updateUser,authentication}
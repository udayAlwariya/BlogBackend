const {signup, signin, updateUser} = require("../controllers/userController")
const express = require("express")
const auth = require("../middlewares/auth")
const userRouter = express.Router()
userRouter.post('/signup',signup)
userRouter.post('/signin',signin)
userRouter.post('/update',auth,updateUser)

module.exports = userRouter


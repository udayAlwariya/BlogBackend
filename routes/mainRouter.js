const express = require("express")
const userRouter = require("./userRouter")
const postRouter = require("./postRouter")
const { authentication } = require("../controllers/userController")
const router = express.Router()
router.use('/user',userRouter)
router.use('/post',postRouter)
router.get('/auth',authentication)
module.exports = router
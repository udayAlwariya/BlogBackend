const commentModel = require("../models/comments")
const postModel = require("../models/post")
const userModel = require("../models/user")
const fs = require("fs")

const create = async(req,res)=>{

    try{
    const file = req.files.image
    const extension = file.name.split(".")[1]
    let fileName  =  Date.now() + "." + extension
    let path = __dirname + "/uploads/" + fileName
    file.mv(path,(err)=>{
        console.log(err)
    })
    const {title,category,description} = req.body
    const userId = req.userID
    let user = await userModel.findOne({_id : userId})
    await postModel.create({
        username:user.firstName,
        userId,
        title,image:String(fileName),category,description
    })
    res.json({
        msg : "Success"
    })
    }catch(e){
        return res.status(404).json({
            msg : "ERROR"
        })
    }
    
}
const getAll =async(req,res)=>{
    try{
        const allPosts = await postModel.find({})
        res.status(200).json({
        allPosts
    })
    }catch(e){
        res.status(404).json({
            msg : "Error"
        })
    }
    
}
const getPost = async (req,res)=>{
    const id = req.params.id
    console.log(id)
    let post = await postModel.findOne({_id : id})
    res.status(200).json({
        post
    })
}

const userSpecificPosts = async(req,res)=>{
    const userId = req.userID
    const allPosts = await postModel.find({userId:userId})
    res.status(200).json({
        allPosts : allPosts
    })


}
const deletePost = async (req,res)=>{
    try{
        const postId = req.params.id
        const deletedPost = await postModel.findOneAndDelete({_id : postId})
        const path = __dirname + "/uploads/" + deletedPost.image;
        fs.unlink(path, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return;
            }
            console.log('File deleted successfully');
        });
        const deleteComments = await commentModel.deleteMany({postId : postId})
        res.status(200).json({
            msg : "done"
        })
    }catch(e){
        res.status(404).json({
            msg : "error"
        })
    }
   
}

const updatePost = async(req,res)=>{
    const updates = {}
    if(req.files && req.files.image){
        const file = req.files.image
        const extension = file.name.split(".")[1]
        let fileName  =  Date.now() + "." + extension
        let path = __dirname + "/uploads/" + fileName
        file.mv(path,(err)=>{
            console.log(err)
        })
        updates.image = String(fileName)
    }
    if (req.body.title) updates.title = req.body.title;
    if (req.body.category) updates.category = req.body.category;
    if (req.body.description) updates.description = req.body.description;
    const postId = req.params.id
    const updatePost = await postModel.findOneAndUpdate({_id : postId},updates,{new:true})
    res.status(200).json({
        msg : updatePost
    })
}

const postComment = async (req,res)=>{

    const postId = req.params.id
    const userID = req.userID
    const user = await userModel.findOne({_id : userID})
  
    const comment = req.body.comment
    console.log(comment)
    const postComment = await commentModel.create({
        username:user.firstName,
        comment : comment,
        postId : postId,
        userId : userID
    })
    console.log(postComment)
    const updatedPost =await postModel.findOneAndUpdate({_id : postId },{
        "$push" : {
            Comments : postComment._id
        }
    },{new:true}).populate("Comments").exec()

    res.status(200).json({
        msg : updatedPost
    })
}

const getComments = async(req,res)=>{
    const postId = req.params.id
    const post = await postModel.find({_id : postId}).populate("Comments").exec()
    return res.status(200).json({
        post : post
    })
}

const deleteComment = async (req,res)=>{
    const commentId = req.params.cmtID
    const postId = req.params.id
    console.log(commentId,postId)
    const deletedComment = await commentModel.findOneAndDelete({_id : commentId})
    const updatedPost = await postModel.findOneAndUpdate({_id : postId},{
        "$pull" : {
            Comments : commentId
        }
    },{new:true}).populate("Comments").exec()
    res.json({
        msg : updatedPost
    })
}

const searchedPost = async (req,res)=>{
    const filter = req.query.filter || ""
    const filterRegex = new RegExp(filter, 'i')
    const filteredPosts =await postModel.find({
        title : {
            "$regex" :  filterRegex
        }
    })
    res.status(200).json({
        filteredPosts
    })
}
module.exports = {create,getAll,getPost,postComment,getComments,userSpecificPosts,deleteComment,updatePost,deletePost,searchedPost}
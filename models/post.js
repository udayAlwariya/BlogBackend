const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    userId : {
        type :mongoose.Schema.Types.ObjectId,
        ref : "userCollection"
    },
    image : {
        type : String,
        required : true
    },
    category : {
        type : Array,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    Comments : [{
        type :mongoose.Schema.Types.ObjectId,
        ref : "commentCollection"
    }]
})

const postModel = mongoose.model('postCollection',postSchema)

module.exports = postModel
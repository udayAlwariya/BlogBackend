const mongoosee = require("mongoose")

const commentSchema = new mongoosee.Schema({
    username : {
        type : String,
        required : true
    },
    comment : {
        type : String,
    },
    postId : {
        type : mongoosee.Schema.Types.ObjectId,
        ref : "postCollection"
    },
    userId : {
        type :mongoosee.Schema.Types.ObjectId,
        ref : "userCollection"
    }
})

const commentModel = mongoosee.model('commentCollection',commentSchema)

module.exports = commentModel
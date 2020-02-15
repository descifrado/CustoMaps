const mongoose = require('mongoose'),
    Joi = require('joi')  //for validating

var ObjectId = mongoose.Schema.Types.ObjectId;

const commentSchema = new mongoose.Schema({

    userEmail: {
        type: String,
    },
    videoId: {
        type: String,
    },
    content: {
        type: String,
        minlength: 5,
        maxlength: 2000,
        required: true,
    },
    uploadTime: {
        type: Date,
        default: Date.now,   //this will automatically add date into this field
    },
    commenterName : {
        type : String,
        required : true
    }
});


var Comment = mongoose.model('Comment', commentSchema);  // 1st arg is the singular object in database 2nd is Schema

module.exports.dbComment = Comment;
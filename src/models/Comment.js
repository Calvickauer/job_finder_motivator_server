const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    createdBy: {
        type: String
    },
    content: {
        type: String
    },
    comments: [{
        type: String
    }],
    postID: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    }
})



const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
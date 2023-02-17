const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const taskCommentSchema = new mongoose.Schema({
    owner: {type: Schema.Types.ObjectId, ref: "User"},
    content: {type: String},
    comments: [{type: Schema.Types.ObjectId, ref: "TaskComment"}],
    taskID: {type: Schema.Types.ObjectId, ref: "Task"},
},{timestamps: true});

const TaskComment = mongoose.model('TaskComment', taskCommentSchema);

module.exports = TaskComment;
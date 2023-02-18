const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const taskCommentSchema = new mongoose.Schema({
    schema_v: {type: Number, default: 1},
    owner: {type: Schema.Types.ObjectId, ref: "User"},
    content: {type: String},
    comments: [{type: Schema.Types.ObjectId, ref: "TaskComment"}],
    taskID: {type: Schema.Types.ObjectId, ref: "Task"},
},{timestamps: true}); //adds .createdAt and .updatedAt and sets them automatically as needed

const TaskComment = mongoose.model('TaskComment', taskCommentSchema);

module.exports = TaskComment;
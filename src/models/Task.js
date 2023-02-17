const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    schema_v: {type: Number, default: 1},
    taskName: {type: String},
    task: {type: String},
    isComplete: {type: Boolean},
    importance: {type: String},
    comments: [{type:  Schema.Types.ObjectId, ref: "TaskComment"}],
    owner: {type: Schema.Types.ObjectId, ref: "User"}
}, {timestamps: true}); //adds .createdAt and .updatedAt and sets them automatically as needed

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
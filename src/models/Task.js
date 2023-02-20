const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    schema_v: {type: Number, default: 1},
    task: {type: String},
    description: {type: String},
    isComplete: {type: Boolean, default: false},
    importance: {type: String},
    target_date: {type: Date},
    comments: [{type:  Schema.Types.ObjectId, ref: "TaskComment"}],
    owner: {type: Schema.Types.ObjectId, ref: "User"}
}, {timestamps: true}); //adds .createdAt and .updatedAt and sets them automatically as needed

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
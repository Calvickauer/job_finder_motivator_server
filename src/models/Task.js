const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    task: {type: String},
    added: {
        type: Date,
        default: Date.now()
    },
    updated: {
        type: Date,
        default: Date.now()
    },
    isComplete: {type: Boolean},
    comments: [{type: String}],
    createdBy: {
        type: String
    }
})

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
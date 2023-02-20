const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const jobCommentSchema = new mongoose.Schema({
    schema_v: {type: Number, default: 1},
    owner: {type: Schema.Types.ObjectId, ref: "User"},
    title: {type: String},
    content: {type: String},
    // comments: [{type: Schema.Types.ObjectId, ref: "JobComment"}],
    jobId: {type: Schema.Types.ObjectId, ref: "Job"},
},{timestamps: true}); //adds .createdAt and .updatedAt and sets them automatically as needed

const JobComment = mongoose.model('JobComment', jobCommentSchema);

module.exports = JobComment;
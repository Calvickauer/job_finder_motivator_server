const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const jobCommentSchema = new mongoose.Schema({
    owner: {type: Schema.Types.ObjectId, ref: "User"},
    content: {type: String},
    comments: [{type: Schema.Types.ObjectId, ref: "JobComment"}],
    jobID: {type: Schema.Types.ObjectId, ref: "Job"},
},{timestamps: true});

const JobComment = mongoose.model('JobComment', jobCommentSchema);

module.exports = JobComment;
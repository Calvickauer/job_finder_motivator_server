const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    schema_v: {type: Number, default: 1},
    owner: {type: Schema.Types.ObjectId, ref: "User"},
    company: {type: String},
    position: {type: String},
    description: {type: String},
    url: {type: String},
    status: {type: String},
    date_applied: {type: Date},
    date_response: {type: Date},
    comments: [{type: Schema.Types.ObjectId, ref: "JobComment"}]
},{timestamps: true}); //adds .createdAt and .updatedAt and sets them automatically as needed



const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
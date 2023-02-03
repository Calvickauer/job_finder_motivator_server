const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const simpleCommentSchema = new mongoose.Schema({
    post_time: {type: Date},
    content: {type: String}
})

const jobSchema = new mongoose.Schema({
    company_name: {type: String},
    company_url: {type: String},
    title: {type: String},
    job_url: {type: String},
    status: {type: String},
    date_applied: {type: Date},
    date_response: {type: Date},
    comments: [{type: simpleCommentSchema}]
})

const taskSchema = new mongoose.Schema({
    task: {type: String},
    added_on: {type: Date},
    isComplete: {type: Boolean},
    completed_on: {type: Date},
    comments: [{type: simpleCommentSchema}]
})

const userSchema = new mongoose.Schema({
    //_id: automatically generated
    schema_v: {type: Number, default: 1},
    email: {type: String, required: true, unique: true},
    name: {type: String, reqired: true},
    display_name: {type: String, required: true, unique: true},
    isSocialDash: {type: Boolean, default: false},
    applied_jobs: [{type: jobSchema}],
    tasks: [{type: taskSchema}],
    external_links: [{
        title: {type: String},
        url: {type: String}
    }],
    job_materials: [{type: Schema.Types.ObjectId, ref: 'Material'}],
    connections: [{type: Schema.Types.ObjectId, ref: 'User'}],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
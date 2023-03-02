const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    //_id: automatically generated
    schema_v: {type: Number, default: 1},
    email: {type: String, required: true, unique: true},
    name: {type: String, reqired: true},
    display_name: {type: String, required: true, unique: true},
    picture: {type: String},
    interests: [{type: String}],
    isSocialDash: {type: Boolean, default: false},
    tasks: [{type: Schema.Types.ObjectId, ref: "Task"}],
    external_links: [{
        idx: {type: Number},
        title: {type: String},
        url: {type: String},
    }],
    jobs: [{type: Schema.Types.ObjectId, ref: "Job"}],
    job_materials: [{type: Schema.Types.ObjectId, ref: 'Material'}],
    connections: [{type: Schema.Types.ObjectId, ref: 'User'}],
    messages_sent: [{type: Schema.Types.ObjectId, ref: 'Message'}],
    messages_received: [{type: Schema.Types.ObjectId, ref: 'Message'}],
}, {timestamps: true}); //adds .createdAt and .updatedAt and sets them automatically as needed

const User = mongoose.model('User', userSchema);

module.exports = User;
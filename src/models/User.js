const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    //_id: automatically generated
    schema_v: {type: Number, default: 1},
    email: {type: String, required: true, unique: true},
    name: {type: String, reqired: true},
    display_name: {type: String, required: true, unique: true},
    isSocialDash: {type: Boolean, default: false},
    tasks: [{type: String}],
    external_links: [{
        title: {type: String},
        url: {type: String}
    }],
    jobs: 
        [{
            type: String
        }],
    job_materials: [{type: Schema.Types.ObjectId, ref: 'Material'}],
    connections: [{type: Schema.Types.ObjectId, ref: 'User'}],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
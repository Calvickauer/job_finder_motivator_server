const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    post_time: {type: Date},
    poster: {type: Schema.Types.ObjectId, ref: 'User'},
    content: {type: String},
    likes: {type: Number},
    dislikes: {type: Number},
})

const materialSchema = new mongoose.Schema({
    //_id: automatically generated
    schema_v: {type: Number, default: 1},
    name: {type: String, reqired: true},
    content: {type: String},
    likes: {type: Number},
    dislikes: {type: Number},
    comments: [{type: commentSchema}],
});

const Material = mongoose.model('Material', materialSchema);

module.exports = Material;
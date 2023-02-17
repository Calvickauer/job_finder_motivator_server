const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const matCommentSchema = new mongoose.Schema({
    owner: {type: Schema.Types.ObjectId, ref: "User"},
    content: {type: String},
    comments: [{type: Schema.Types.ObjectId, ref: "MaterialComment"}],
    materialID: {type: Schema.Types.ObjectId, ref: "Material"},
},{timestamps: true});

const MaterialComment = mongoose.model('MaterialComment', matCommentSchema);

module.exports = MaterialComment;
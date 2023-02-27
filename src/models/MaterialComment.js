const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const matCommentSchema = new mongoose.Schema({
    schema_v: {type: Number, default: 1},
    owner: {type: Schema.Types.ObjectId, ref: "User"},
    owner_name: {type: String},
    title: {type: String},
    content: {type: String},
    // comments: [{type: Schema.Types.ObjectId, ref: "MaterialComment"}],
    materialId: {type: Schema.Types.ObjectId, ref: "Material"},
},{timestamps: true}); //adds .createdAt and .updatedAt and sets them automatically as needed

const MaterialComment = mongoose.model('MaterialComment', matCommentSchema);

module.exports = MaterialComment;
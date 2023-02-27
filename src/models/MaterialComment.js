const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const matCommentSchema = new mongoose.Schema({
    schema_v: {type: Number, default: 1},
    owner: {type: Schema.Types.ObjectId, ref: "User"},
    owner_name: {type: String},
    title: {type: String},
    content: {type: String},
    likes: [{type: Schema.Types.ObjectId, ref:"User"}],
    materialId: {type: Schema.Types.ObjectId, ref: "Material"},
},{timestamps: true, toJSON: { virtuals: true }}); //adds .createdAt and .updatedAt and sets them automatically as needed

matCommentSchema.virtual('num_likes').get(function() {
    return this.likes.length;
});
const MaterialComment = mongoose.model('MaterialComment', matCommentSchema);

module.exports = MaterialComment;
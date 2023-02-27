const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    //_id: automatically generated
    schema_v: {type: Number, default: 1},
    name: {type: String, required: true},
    content: {type: String, required: true},
    likes: [{type: Schema.Types.ObjectId, ref:"User"}],
    comments: [{type: Schema.Types.ObjectId, ref:"MaterialComment"}],
    owner: {type: Schema.Types.ObjectId, ref:"User", required: true},
},{timestamps: true, toJSON: { virtuals: true }}); //adds .createdAt and .updatedAt and sets them automatically as needed

materialSchema.virtual('num_likes').get(function() {
    return this.likes.length;
});
const Material = mongoose.model('Material', materialSchema);

module.exports = Material;
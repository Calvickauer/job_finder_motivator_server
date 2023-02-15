const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    //_id: automatically generated
    schema_v: {type: Number, default: 1},
    name: {type: String, required: true},
    content: {type: String, required: true},
    likes: {type: Number},
    dislikes: {type: Number},
    comments: [{type: Schema.Types.ObjectId, ref:"comment"}],
    owner: {type: Schema.Types.ObjectId, ref:"owner", required: true},
});

const Material = mongoose.model('Material', materialSchema);

module.exports = Material;
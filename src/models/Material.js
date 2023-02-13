const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    //_id: automatically generated
    schema_v: {type: Number, default: 1},
    name: {type: String, reqired: true},
    content: {type: String},
    likes: {type: Number},
    dislikes: {type: Number},
    comments: [{type: Schema.Types.ObjectId, ref:"comment"}],
    owner: {type: Schema.Types.ObjectId, ref:"owner"},
});

const Material = mongoose.model('Material', materialSchema);

module.exports = Material;
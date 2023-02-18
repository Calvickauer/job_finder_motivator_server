const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    //_id: automatically generated
    schema_v: {type: Number, default: 1},
    subject: {type: String, required: true, default: "Message"},
    content: {type: String, required: true},
    owner: {type: Schema.Types.ObjectId, ref:"User", required: true},
    recipient: {type: Schema.Types.ObjectId, ref:"User", required: true},
}, {timestamps: true}); //adds .createdAt and .updatedAt and sets them automatically as needed

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
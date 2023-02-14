const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    //_id: automatically generated
    schema_v: {type: Number, default: 1},
    subject: {type: String, required: true, default: "Message"},
    content: {type: String, required: true},
    // likes: {type: Number},
    // dislikes: {type: Number},
    // comments: [{type: Schema.Types.ObjectId, ref:"comment"}],
    owner: {type: Schema.Types.ObjectId, ref:"owner", required: true},
    recipient: {type: Schema.Types.ObjectId, ref:"recipient", required: true},
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // name: {type: String, reqired: true},
    // gamertag: {type: String, required: true, unique: true},
    // email: {type: String, unique: true},
    // password: {type: String, required: true},
    // balance: {type: Number, default: 100, min: 0},
    // friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
    // ownedCards: [{type: Schema.Types.ObjectId, ref: 'Card'}],
    // deck: [{type: Schema.Types.ObjectId, ref: 'Card'}],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
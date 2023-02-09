const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    user: {
        type: String
    },
    company: {type: String},
    position: {type: String},
    status: {type: String},
    date_applied: {type: Date},
    date_response: {type: Date},
})



const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
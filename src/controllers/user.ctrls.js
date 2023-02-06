const db = require('../models');
const seedData = {
    post_time: {type: Date},
    content: {type: String}
}

const jobSchema = new mongoose.Schema()


const userSchema = new mongoose.Schema({
    //_id: automatically generated
    schema_v: {type: Number, default: 1},
    email: {type: String, required: true, unique: true},
    name: {type: String, reqired: true},
    display_name: {type: String, required: true, unique: true},
    isSocialDash: {type: Boolean, default: false},
    applied_jobs: [{
        company_name: {type: String},
        company_url: {type: String},
        title: {type: String},
        job_url: {type: String},
        status: {type: String},
        date_applied: {type: Date},
        date_response: {type: Date},
        comments: [{
            post_time: {type: Date},
            content: {type: String}
        }]
    },{
        company_name: {type: String},
        company_url: {type: String},
        title: {type: String},
        job_url: {type: String},
        status: {type: String},
        date_applied: {type: Date},
        date_response: {type: Date},
        comments: [{
            post_time: {type: Date},
            content: {type: String}
        }]
    }],
    tasks: [{
        task: {type: String},
        added_on: {type: Date},
        isComplete: {type: Boolean},
        completed_on: {type: Date},
        comments: [{
            post_time: {type: Date},
            content: {type: String}
        }]
    },{
        task: {type: String},
        added_on: {type: Date},
        isComplete: {type: Boolean},
        completed_on: {type: Date},
        comments: [{
            post_time: {type: Date},
            content: {type: String}
        }]
    }],
    external_links: [{
        title: {type: String},
        url: {type: String}
    }],
    job_materials: [{type: Schema.Types.ObjectId, ref: 'Material'}],
    connections: [{type: Schema.Types.ObjectId, ref: 'User'}],
});
;


const seed = async (req, res) => {
    console.log('hit seed route');

    return res.status(200).json({ message: 'seeded user data' });
}


//  Log user session out
const test = (req, res) => {
    console.log("test route hit");
    return res.status(200).json({ message: 'logged out' });
}


module.exports = {
    seed,
    test,
};

const db = require('../models');

//Get user job list all jobs for logged in user
const getJobs = async (req, res) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        if (user) {
            const jobs = await db.Job.find({owner: user._id}).populate("comments");
            if (jobs) {
                return res.status(200).json({ data: {jobs}, status: {code: 200, message: "SUCCESS: found jobs"} });
            } else {
                return res.status(404).json({ data: {}, status: {code: 404, message: "INFO: user has no jobs"} });
            }
        } else {
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: user not found"} });
        }
    } catch (err) {
         //catch any errors
         return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
}

//Get single job with comments
const getJob = async (req, res) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        if (user) {
            const job = await db.Task.findById(req.params.jobId).populate("comments");
            if (job) {
                return res.status(200).json({ data: {job}, status: {code: 200, message: "SUCCESS: found job"} });
            } else {
                return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: job not found"} });
            }
        } else {
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: user not found"} });
        }
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
}

//creates job and adds it to the user
const postJob = async (req, res) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        if (user) {
            const job = await db.Job.create({
                owner: user._id,
                company: req.body.company ? req.body.company : null,
                position: req.body.position ? req.body.position : null,
                description: req.body.description ? req.body.description : null,
                url: req.body.url ? req.body.url : null,
                status: req.body.status ? req.body.status : null,
                date_applied: req.body.date_applied ? req.body.date_applied : null,
                date_response: req.body.date_response ? req.body.date_response : null,
                comments: [],
            });
            if (job) {
                user.jobs.push(job);
                user.save();
                return res.status(200).json({ data: {job}, status: {code: 200, message: "SUCCESS: created job"} });
            } else {
                return res.status(400).json({ data: {}, status: {code: 400, message: "ERROR: failed to create job"} });
            }
        } else {
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: user not found"} });
        }
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
}

//Update a job
const updateJob = async (req, res) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        if (user) {
            const job = await db.Job.findById(req.params.jobId);
            if (job && job.owner.toString() === user._id.toString()) {
                job.company = req.body.company ? req.body.company : job.company;
                job.position = req.body.position ? req.body.position : job.position;
                job.description = req.body.description ? req.body.description : job.description;
                job.url = req.body.url ? req.body.url : job.url;
                job.status = req.body.status ? req.body.status : job.status;
                job.date_applied = req.body.date_applied ? req.body.date_applied : job.date_applied;
                job.date_response = req.body.date_response ? req.body.date_response : job.date_response;
                job.save();
                return res.status(200).json({ data: {job}, status: {code: 200, message: "SUCCESS: updated job"} });
            } else if (job) {
                return res.status(403).json({ data: {}, status: {code: 403, message: "ERROR: user can only update owned jobs"} });
            } else{
                return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: job not found"} });
            }
        } else {
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: user not found"} });
        }
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
}

//Delete a job
const deleteJob = async (req, res) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        if (user) {
            const job = await db.Job.findById(req.params.jobId);
            if (job && job.owner.toString() === user._id.toString()) {
                await db.JobComment.deleteMany({ _id: { $in: job.comments}});
                const idx = user.jobs.indexOf(req.params.jobId);
                if (idx != -1) {
                    user.jobs.splice( idx, 1 );
                    user.save();
                }
                await db.Job.findByIdAndDelete(req.params.jobId);
                return res.status(200).json({ data: {}, status: {code: 200, message: "SUCCESS: job deleted"} });
            } else if (job) {
                return res.status(403).json({ data: {}, status: {code: 403, message: "ERROR: user can only delete owned jobs"} });
            } else {
                return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: job not found"} });
            }
        } else {
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: user not found"} });
        }
    } catch (err) {
         //catch any errors
         return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
}

//create a comment on a job
const postJobComment = async (req, res) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        if (user) {
            let job = await db.Job.findById(req.params.jobId);
            if (job) {
                const jobComment = await db.JobComment.create({
                    owner: user._id,
                    title: req.body.title ? req.body.title : null,
                    content: req.body.content ? req.body.content : null,
                    jobId: job._id,
                });
                if (jobComment) {
                    job.comments.push(jobComment._id);
                    await job.save();
                    job = await db.Job.findById(req.params.jobId).populate('comments');
                    return res.status(201).json({ data: {job: job, comment: jobComment}, status: {code: 201, message: "SUCCESS: created comment"} });
                } else {
                    return res.status(400).json({ data: {}, status: {code: 400, message: "ERROR: failed to create comment"} });
                }
            } else {
                return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: job not found"} });
            }
        } else {
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: user not found"} });
        }
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
} 

//return one comment
const showJobComment = async ( req, res ) => {
    try{
        const comment = await db.JobComment.findById(req.params.commentId);
        if (comment){
            return res.status(200).json({ data: {comment}, status: {code: 200, message: "SUCCESS: comment found"} });
        } else {
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: comment not found"} });
        }
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
}

//update a comment
const updateJobComment = async ( req, res ) => {
    try {
        const userId = await db.User.findOne({email: req.user.email})._id;
        if (user) {
            const comment = await db.JobComment.findById(req.params.commentId);
            if (comment && comment.owner.toString() === userId.toString()) {
                comment.title = req.body.title ? req.body.title : comment.title;
                comment.content = req.body.content ? req.body.content : comment.content;
                comment.save();
                return res.status(200).json({ data: {comment}, status: {code: 200, message: "SUCCESS: updated comment"} });
            } else if (comment) {
                return res.status(403).json({ data: {}, status: {code: 403, message: "ERROR: user can only update owned comments"} });
            } else {
                return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: comment not found"} });
            }
        } else {
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: user not found"} });
        }
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
};

//Delete a job comment
const deleteJobComment = async (req, res) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        if (user) {
            const comment = await db.JobComment.findById(req.params.commentId);
            if (comment && comment.owner.toString() === user._id.toString()) {
                const job = await db.Job.findById(comment.jobId);
                if (job) {
                    const idx = job.comments.indexOf(comment._id);
                    if (idx != -1) {
                        job.comments.splice( idx, 1 );
                        job.save();
                    }
                }
                await db.JobComment.findByIdAndDelete(comment._id);
                return res.status(200).json({ data: {}, status: {code: 200, message: "SUCCESS: comment deleted"} });
            } else if (comment) {
                return res.status(403).json({ data: {}, status: {code: 403, message: "ERROR: only allowed to delete owned comment"} });
            } else {
                return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: comment not found"} });
            }
        } else {
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: user not found"} });
        }
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
}

module.exports = {
    getJobs,
    getJob,
    postJob,
    updateJob,
    deleteJob,
    postJobComment,
    showJobComment,
    updateJobComment,
    deleteJobComment,
};
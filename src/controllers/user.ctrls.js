const { user } = require('.');
const db = require('../models');

const seed =  (req, res) => {
    console.log('hit seed route');
    console.log(req.user)
    return res.json({payload: req.user})
}

const makeUnique = (str) => {
    return `${str}${Date.now()}`;
}

const login = async (req, res) => {
    // console.log("here",{user: req.user});
    try{
        let user = await db.User.findOne({email: req.user.email})
        .populate("tasks")
        .populate("jobs")
        .populate("job_materials")
        .populate("connections")
        .populate("messages_sent")
        .populate("messages_received");
        
        if (user) {
            return res.status(200).json({ data: {user}, status: {code: 200, message: "SUCCESS: returning user logged in"} });
        } else {
            user = await db.User.create({
                name: req.user.name,
                email: req.user.email,
                display_name: makeUnique(req.user.name),
                isSocialDash: true,
                tasks: [],
                external_links: [],
                jobs: [],
                job_materials: [],
                connections: [],
                messages_sent: [],
                messages_received: [],
            })
            return res.status(201).json({ data: {user}, status: {code: 201, message: "SUCCESS: new user created"} });
        }
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
}

const logout = (req, res) => {
    //do nothing user should already be logged out through auth0
    return res.status(200).json({ data: {}, status: {code: 200, message: "SUCCESS: user logged out"} });
}

//GET Users return any user for reference
const getUser = async (req, res) => {
    try {
        let user = await db.User.findOne({display_name: req.params.display_name});
        if (user) {
            if (req.user.email === user.email) {
                // if user is current user return populated user data otherwise return
                // the unpopulated user data
                user = await db.User.findOne({display_name: req.params.display_name})
                .populate("tasks")
                .populate("jobs")
                .populate("job_materials")
                .populate("connections")
                .populate("messages_sent")
                .populate("messages_received");
            } 
            return res.status(200).json({ data: {user}, status: {code: 200, message: "SUCCESS: found user"} });
        } else {
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: user not found"} });
        }
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
}

//Update personal user profile info return user
//USE THIS FOR INITIAL SIGN UP
const updateUserInfo = async (req, res) => {
    try {
        const user = await db.User.findOne({email: req.user.email})
        .populate("tasks")
        .populate("jobs")
        .populate("job_materials")
        .populate("connections")
        .populate("messages_sent")
        .populate("messages_received");
        if (user) {
            const checkName = await db.User.find({display_name: req.body.display_name});
            if (checkName && user._id != checkName._id) {
                return res.status(403).json({ data: {}, status: {code: 403, message: "ERROR: display_name already taken"} });
            } 
            user.display_name = req.body.display_name ? req.body.display_name : user.display_name;
            user.isSocialDash = req.body.isSocialDash ? req.body.isSocialDash : user.isSocialDash;
            user.save();
            return res.status(200).json({ data: {user}, status: {code: 200, message: "SUCCESS: user has been updated"} });
        } else {
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: user not found"} });
        }
    } catch (err) {
         //catch any errors
         return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
}

// delete a user and all refs to it
const deleteUser = async (req, res) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        if (user) {
            // delete all job comments
            const jobs = await db.Job.find({owner: user._id});
            const jobIds = jobs.map((job)=> {return job._id});
            await db.JobComment.deleteMany({$or: [{jobId: {$in:{jobIds}}}, {owner: user._id}]});
            // delete all jobs
            await db.Job.deleteMany({owner: user._id});
            // delete all material comments
            const materials = await db.Material.find({owner: user._id});
            const materialIds = materials.map((material)=> {return material._id});
            await db.MaterialComment.deleteMany({$or: [{materialId: {$in:{materialIds}}}, {owner: user._id}]});
            // delete all materials
            await db.Material.deleteMany({owner: user._id});
            // delete all task comments
            const tasks = await db.Task.find({owner: user._id});
            const taskIds = tasks.map((task)=> {return task._id});
            await db.TaskComment.deleteMany({$or: [{taskId: {$in:{taskIds}}}, {owner: user._id}]});
            // delete all tasks
            await db.Task.deleteMany({owner: user._id});
            // delete all messages
            await db.Message.deleteMany({$or: [{owner: _id}, {recipient: _id}]});
            // delete this user
            await db.User.findByIdAndDelete(user._id);

            return res.status(200).json({ data: {}, status: {code: 200, message: "SUCCESS: user has been deleted"} });

        } else {
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: user not found"} });
        }
    } catch (err) {
         //catch any errors
         return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
}

//Get Tasks all tasks for current user
const getTasks = async (req, res) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        if (user) {
            const tasks = await db.Task.find({owner: user._id}).populate("comments");
            if (tasks) {
                return res.status(200).json({ data: {tasks}, status: {code: 200, message: "SUCCESS: found tasks"} });
            } else {
                return res.status(404).json({ data: {}, status: {code: 404, message: "INFO: user has no tasks"} });
            }
        } else {
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: user not found"} });
        }
    } catch (err) {
         //catch any errors
         return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
}

//Get single task with comments
const getTask = async (req, res) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        if (user) {
            const task = await db.Task.findById(req.params.taskId).populate("comments");
            if (task && task.owner === user._id) {
                return res.status(200).json({ data: {task}, status: {code: 200, message: "SUCCESS: found task"} });
            } else if (task) {
                return res.status(403).json({ data: {}, status: {code: 403, message: "ERROR: user does not match"} });
            } else {
                return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: task not found"} });
            }
        } else {
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: user not found"} });
        }
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
}

//creates task and adds it to the user
const postTask = async (req, res) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        if (user) {
            const task = await db.Task.create({
                task: req.body.task ? req.body.task : null,
                description: req.body.description ? req.body.description : null,
                isComplete: req.body.isComplete ? req.body.isComplete : false,
                importance: req.body.importance ? req.body.importance : null,
                target_date: req.body.target_date ? req.body.target_date : null,
                comments: [],
                owner: user._id,
            });
            if (task) {
                user.tasks.push(task);
                user.save();
                return res.status(200).json({ data: {task}, status: {code: 200, message: "SUCCESS: created task"} });
            } else {
                return res.status(400).json({ data: {}, status: {code: 400, message: "ERROR: failed to create task"} });
            }
        } else {
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: user not found"} });
        }
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
}

//Update a task
const updateTask = async (req, res) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        if (user) {
            const task = await db.Task.findById(req.params.taskId);
            if (task && task.owner === user._id) {
                task.task = req.body.task ? req.body.task : task.task;
                task.description = req.body.description ? req.body.description : task.description;
                task.isComplete = req.body.isComplete ? req.body.isComplete : task.isComplete;
                task.importance = req.body.importance ? req.body.importance : task.importance;
                task.target_date = req.body.target_date ? req.body.target_date : task.target_date;
                task.save();
                return res.status(200).json({ data: {task}, status: {code: 200, message: "SUCCESS: updated task"} });
            } else if (task) {
                return res.status(403).json({ data: {}, status: {code: 403, message: "ERROR: user can only update owned tasks"} });
            } else{
                return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: task not found"} });
            }
        } else {
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: user not found"} });
        }
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
}

//Delete a task
const deleteTask = async (req, res) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        if (user) {
            const task = await db.Task.findById(req.params.taskId);
            if (task && task.owner === user._id) {
                await db.TaskComment.deleteMany({ _id: { $in: task.comments}});
                const idx = user.tasks.indexOf(req.params.taskId);
                if (idx != -1) {
                    user.tasks.splice( idx, 1 );
                    user.save();
                }
                await db.Task.findByIdAndDelete(req.params.taskId);
                return res.status(200).json({ data: {}, status: {code: 200, message: "SUCCESS: task deleted"} });
            } else if (task) {
                return res.status(403).json({ data: {}, status: {code: 403, message: "ERROR: user can only delete owned tasks"} });
            } else {
                return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: task not found"} });
            }
        } else {
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: user not found"} });
        }
    } catch (err) {
         //catch any errors
         return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
}

//create a comment on a task
const postTaskComment = async (req, res) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        if (user) {
            const task = await db.Task.findById(req.params.taskId);
            if (task) {
                const taskComment = await db.TaskComment.create({
                    owner: user._id,
                    title: req.body.title ? req.body.title : null,
                    content: req.body.content ? req.body.content : null,
                    taskId: task._id,
                });
                if (taskComment) {
                    task.comments.push(taskComment._id);
                    return res.status(201).json({ data: {taskComment}, status: {code: 201, message: "SUCCESS: created comment"} });
                } else {
                    return res.status(400).json({ data: {}, status: {code: 400, message: "ERROR: failed to create comment"} });
                }
            } else {
                return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: task not found"} });
            }
        } else {
            return res.status(404).json({ data: {}, status: {code: 404, message: "ERROR: user not found"} });
        }
    } catch (err) {
        //catch any errors
        return res.status(400).json({ data: {}, status: {code: 400, message: err.message} });
    }
} 

const showTaskComment = async ( req, res ) => {
    try{
        const comment = await db.TaskComment.findById(req.params.commentId);
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

const updateTaskComment = async ( req, res ) => {
    try {
        const userId = await db.User.findOne({email: req.user.email})._id;
        if (user) {
            const comment = await db.TaskComment.findById(req.params.commentId);
            if (comment && comment.owner === userId) {
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

//Delete a task comment
const deleteTaskComment = async (req, res) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        if (user) {
            const comment = await db.TaskComment.findById(req.params.commentId);
            if (comment && comment.owner === user._id) {
                const task = await db.Task.findById(comment.taskId);
                if (task) {
                    const idx = task.comments.indexOf(comment._id);
                    if (idx != -1) {
                        task.comments.splice( idx, 1 );
                        task.save();
                    }
                }
                await db.TaskComment.findByIdAndDelete(comment._id);
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
            if (job && job.owner === user._id) {
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
            if (job && job.owner === user._id) {
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
            const job = await db.Job.findById(req.params.jobId);
            if (job) {
                const jobComment = await db.JobComment.create({
                    owner: user._id,
                    title: req.body.title ? req.body.title : null,
                    content: req.body.content ? req.body.content : null,
                    taskId: job._id,
                });
                if (jobComment) {
                    job.comments.push(jobComment._id);
                    return res.status(201).json({ data: {jobComment}, status: {code: 201, message: "SUCCESS: created comment"} });
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
            if (comment && comment.owner === userId) {
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
            if (comment && comment.owner === user._id) {
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
    seed,
    login,
    logout,
    getUser,
    updateUserInfo,
    deleteUser,
    // TODO break these out into separate file
    getTasks,
    getTask,
    postTask,
    updateTask,
    deleteTask,
    postTaskComment,
    showTaskComment,
    updateTaskComment,
    deleteTaskComment,
    // TODO break these out into separate file
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



















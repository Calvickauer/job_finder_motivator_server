const db = require('../models');

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
            if (task && task.owner.toString() === user._id.toString()) {
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
            if (task && task.owner.toString() === user._id.toString()) {
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
            if (task) {
                if(task.owner.toString() === user._id.toString()) {
                    // console.log({task: task,owner: task.owner, user: user._id});
                    await db.TaskComment.deleteMany({ _id: { $in: task.comments}});
                    const idx = user.tasks.indexOf(req.params.taskId);
                    if (idx != -1) {
                        user.tasks.splice( idx, 1 );
                        user.save();
                    }
                    await db.Task.findByIdAndDelete(req.params.taskId);
                    return res.status(200).json({ data: {}, status: {code: 200, message: "SUCCESS: task deleted"} });
                } else {
                    return res.status(403).json({ data: {}, status: {code: 403, message: "ERROR: user can only delete owned tasks"} });
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

//Delete a task comment
const deleteTaskComment = async (req, res) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        if (user) {
            const comment = await db.TaskComment.findById(req.params.commentId);
            if (comment && comment.owner.toString() === user._id.toString()) {
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
module.exports = {
    getTasks,
    getTask,
    postTask,
    updateTask,
    deleteTask,
    postTaskComment,
    showTaskComment,
    updateTaskComment,
    deleteTaskComment,
};
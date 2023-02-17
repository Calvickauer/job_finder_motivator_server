const db = require('../models');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/User')
const Comment = require('../models/MaterialComment')
const Job = require('../models/Job')
const Task = require('../models/Task')

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
        let user = await db.User.findOne({email: req.user.email});
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
        const user = await db.User.findOne({display_name: req.params.display_name});
        if (user) {
            return res.status(200).json({ data: {user}, status: {code: 200, message: "SUCCESS: found user"} });
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
            const task = await db.Task.findById(req.params.TaskId).populate("comments");
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

//Get user job list all jobs for logged in user
const getJobs = async (req, res) => {
    try {
        const user = await db.User.findOne({email: req.user.email});
        if (user) {
            const jobs = await db.Job.find({owner: user._id}).populate("comments");
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


    Job.find({user: req.params.email})
    .then(jobsOfUser => {
        res.json({jobsOfUser: jobsOfUser})
    })
}

//Check if a user is new, if not add them to our database
// const checkIfNew = (req, res) => {
//     User.find({email: req.params.email})
//     .then(user => {
//         console.log(user)
//         if(user.email == req.params.email) {
//             return res.status(400).json({ message: "User already exists!" }); 
//         } User.create({
//             name: req.params.name,
//             email: req.params.email,
//             display_name: req.params.name,
//             isSocialDash: true,
//             tasks: [],
//             external_links: [],
//             jobs: [],
//             job_materials: [],
//             connections: []
//         })
//         .then(newUser => {
//             console.log('New user =>>', newUser);
//             res.json({newUser: newUser})
//         })
//         .catch(error => { 
//             console.log('error', error) 
//             res.json({ message: 'email already exists!' })
//         });
//     })
//     .catch(error => { 
//         console.log('error', error) 
//         res.json({ message: error })
//     })
// }

//Update personal user profile info return user
const updatePersonalInfo = (req, res) => {
        User.findByIdAndUpdate(req.params.id, {
            display_name: req.body.name,
            isSocialDash: req.body.isSocialDash,
        })
        .then(updatedUser => {
            console.log('Updated User =>>', updatedUser);
            res.json({updatedUser: updatedUser})
        })
        .catch(error => { 
            console.log('error', error) 
            res.json({ message: 'email already exists!' })
        });
    }

// delete a user and all refs to it
const deleteUser = (req, res) => {
    User.findByIdAndDelete(req.params.id)
    .then(deletedUser => {
        console.log('Deleted user =>>', deletedUser);
        res.json({deletedUser: deletedUser})
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: 'email already exists!' })
    });
}



//creates task and adds it to the user
const postTask = (req, res) => {
    Task.create({
        taskName: req.body.taskName,
        task: req.body.task,
        isComplete: false,
        comments: [],
        importance: req.body.importance,
        createdBy: req.params.email,
    })
    .then(createdTask => {
        console.log("new task", createdTask)
        User.findOne({email: req.params.email})
.then(user => {
    console.log("found user", user)
    const currentTasks = user.tasks
    console.log(user)
    currentTasks.push(createdTask._id)
    User.findOneAndUpdate({email: req.params.email}, {
        tasks: currentTasks
    })
    .then(response => {
        console.log("new task", response)
        res.json({tasks: response.tasks})
    }).catch(error => { 
        console.log('error', error) 
        res.json({ message: error })
    });    
    })
    }).catch(error => { 
    console.log('error', error) 
    res.json({ message: error })
});   
}

//Update a task
const updateTaskIntent = (req, res) => {
       Task.findByIdAndUpdate(req.params.id, {
            task: req.body.newTask, 
            updated: Date.now(),
            isComplete: req.body.isComplete
        })
        .then(response => {
            console.log("task updated", response)
            res.json({updatedTask: response})
        }).catch(error => { 
            console.log('error', error) 
            res.json({ message: error })
        });    
    }

//create a comment on a task
const postTaskComment = (req, res) => {
    Comment.create({
        createdBy: req.body.name,
        content: req.body.content,
        comments: ['no comments yet'],
        postID: req.params.postID
    }).then(createdComment => {
        console.log("new comment", createdComment)
        Task.findById( req.params.postID)
        .then(foundTask => {
            const taskComments = foundTask.comments
            taskComments.push(createdComment._id)
            Task.findByIdAndUpdate(req.params.postID, {
            comments: taskComments
        }).then(response =>{
            res.json({taskWithNewComment: response})
        })
        }).catch(error => { 
            console.log('error', error) 
            res.json({ message: error })
        });  
    }).catch(error => { 
        console.log('error', error) 
        res.json({ message: error })
    });  
} 

//add jobs of concern to user profile
const postJob = (req, res) => {
    Job.create({
        user: req.params.email,
        company: req.body.company,
        position: req.body.position,
        status: req.body.status,
        date_applied: Date.now(),
        date_response: Date.now()
    }).then(createdJob => {
        User.findOne({name: req.params.name})
        .then(foundUser => {
        const userJobs = foundUser.jobs
        userJobs.push(createdJob._id)
        User.findOneAndUpdate({name: req.params.name}, {
            jobs: userJobs 
        }).then(response => {
            res.json({res: response})
        })
        })
    })
}

//Delete a task
const deleteTask = (req, res) => {
    Task.findByIdAndRemove(req.params.id) 
        .then(deletedTask => {
            res.json({deletedTask: deletedTask})
        })
}

//Delete a task comment
const deleteTaskComment = (req, res) => {
    Comment.findByIdAndRemove(req.params.id) 
        .then(deletedComment => {
            res.json({deletedComment: deletedComment})
        })
}




//  Log user session out
const test = (req, res) => {
    console.log("test route hit");
    return res.status(200).json({ message: 'logged out' });
}




module.exports = {
    seed,
    login,
    logout,
    test,
    postTask,
    updateTaskIntent,
    postTaskComment,
    deleteTask,
    deleteTaskComment,
    updatePersonalInfo,
    deleteUser,
    postJob,
    getJobs,
    getTask,
    getTasks,
    getUser,
};

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
            if (req.user.email.toString() === user.email.toString()) {
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
            if (checkName && user._id.toString() != checkName._id.toString()) {
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

module.exports = {
    seed,
    login,
    logout,
    getUser,
    updateUserInfo,
    deleteUser,
};



















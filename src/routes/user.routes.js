const express = require('express');
const router = express.Router();
const {
    checkRequiredPermissions,
    validateAccessToken,
} = require("../middleware/auth0.middleware.js");
const { Permissions } = require("../security/permissions.js");
const ctrls = require('../controllers');

router.post('/seed', validateAccessToken, checkRequiredPermissions([]), ctrls.user.seed);
router.get('/login', validateAccessToken, checkRequiredPermissions([]), ctrls.user.login);
router.get('/logout', ctrls.user.logout);
router.get('/:name', ctrls.user.getUsers);
router.get('/tasks/:email', ctrls.user.getTasks);
router.get('/taskcomments/:id', ctrls.user.taskComments);
router.get('/jobs/:name', ctrls.user.userJobs);
router.post('/create/:name/:email', ctrls.user.checkIfNew);
router.put('/postjob/:name', ctrls.user.postJob);
router.put('/:email/createtask', ctrls.user.postTask);
router.put('/task/:id/update', ctrls.user.updateTaskIntent);
router.put('/comment/task/:postID', ctrls.user.postTaskComment);
//USE THIS FOR UPDATE/CREATE PROFILE
router.put('/:id/update', ctrls.user.updatePersonalInfo);
router.delete('/:id/delete', ctrls.user.deleteUser);
router.delete('/delete/task/:id', ctrls.user.deleteTask);
router.delete('/delete/comment/:id', ctrls.user.deleteTaskComment);


module.exports = router;

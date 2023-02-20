const express = require('express');
const router = express.Router();
const {
    checkRequiredPermissions,
    validateAccessToken,
} = require("../middleware/auth0.middleware.js");
const { Permissions } = require("../security/permissions.js");
const ctrls = require('../controllers');

router.post('/seed', validateAccessToken, checkRequiredPermissions([]), ctrls.user.seed);
//user
router.get('/login', validateAccessToken, checkRequiredPermissions([]), ctrls.user.login);
router.get('/logout', ctrls.user.logout);
router.get('/:display_name', validateAccessToken, checkRequiredPermissions([]), ctrls.user.getUser);
 //USE THIS FOR UPDATE/CREATE PROFILE
router.put('/update', validateAccessToken, checkRequiredPermissions([]), ctrls.user.updateUserInfo);
router.delete('/delete', validateAccessToken, checkRequiredPermissions([]), ctrls.user.deleteUser);

//task TODO break this out into separate file
router.get('/task', validateAccessToken, checkRequiredPermissions([]), ctrls.user.getTasks);
router.post('/task', validateAccessToken, checkRequiredPermissions([]), ctrls.user.postTask);
router.get('/task/:taskId', validateAccessToken, checkRequiredPermissions([]), ctrls.user.getTask);
router.put('/task/:taskId', validateAccessToken, checkRequiredPermissions([]), ctrls.user.updateTask);
router.delete('/task/:taskId', validateAccessToken, checkRequiredPermissions([]), ctrls.user.deleteTask);
router.post('/task/comment/:taskId', validateAccessToken, checkRequiredPermissions([]), ctrls.user.postTaskComment);
router.delete('/task/comment/:commentId', validateAccessToken, checkRequiredPermissions([]), ctrls.user.deleteTaskComment);

//job TODO complete routes and break out into separate file
router.get('/job', validateAccessToken, checkRequiredPermissions([]), ctrls.user.getJobs);
router.post('/job', validateAccessToken, checkRequiredPermissions([]), ctrls.user.postJob);
router.get('/job/:jobId', validateAccessToken, checkRequiredPermissions([]), ctrls.user.getJob);
router.put('/job/:jobId', validateAccessToken, checkRequiredPermissions([]), ctrls.user.updateJob);
router.delete('/job/:jobId', validateAccessToken, checkRequiredPermissions([]), ctrls.user.deleteJob);
router.post('/job/comment/:jobId', validateAccessToken, checkRequiredPermissions([]), ctrls.user.postJobComment);
router.delete('/job/comment/:commentId', validateAccessToken, checkRequiredPermissions([]), ctrls.user.deleteJobComment);

module.exports = router;

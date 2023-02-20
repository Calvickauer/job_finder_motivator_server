const express = require('express');
const router = express.Router();
const {
    checkRequiredPermissions,
    validateAccessToken,
} = require("../middleware/auth0.middleware.js");
const { Permissions } = require("../security/permissions.js");
const ctrls = require('../controllers');

//task TODO break this out into separate file
router.get      ('/', validateAccessToken, checkRequiredPermissions([]), ctrls.task.getTasks);
router.post     ('/', validateAccessToken, checkRequiredPermissions([]), ctrls.task.postTask);
router.get      ('/:taskId', validateAccessToken, checkRequiredPermissions([]), ctrls.task.getTask);
router.put      ('/:taskId', validateAccessToken, checkRequiredPermissions([]), ctrls.task.updateTask);
router.delete   ('/:taskId', validateAccessToken, checkRequiredPermissions([]), ctrls.task.deleteTask);
router.post     ('/comment/:taskId', validateAccessToken, checkRequiredPermissions([]), ctrls.task.postTaskComment);
router.get      ('/comment/:commentId', validateAccessToken, checkRequiredPermissions([]), ctrls.task.showTaskComment);
router.put      ('/comment/:commentId', validateAccessToken, checkRequiredPermissions([]), ctrls.task.updateTaskComment);
router.delete   ('/comment/:commentId', validateAccessToken, checkRequiredPermissions([]), ctrls.task.deleteTaskComment);

module.exports = router;
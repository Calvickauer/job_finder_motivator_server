const express = require('express');
const router = express.Router();
const {
    checkRequiredPermissions,
    validateAccessToken,
} = require("../middleware/auth0.middleware.js");
const { Permissions } = require("../security/permissions.js");
const ctrls = require('../controllers');

//job TODO complete routes and break out into separate file
router.get      ('/', validateAccessToken, checkRequiredPermissions([]), ctrls.job.getJobs);
router.post     ('/', validateAccessToken, checkRequiredPermissions([]), ctrls.job.postJob);
router.get      ('/:jobId', validateAccessToken, checkRequiredPermissions([]), ctrls.job.getJob);
router.put      ('/:jobId', validateAccessToken, checkRequiredPermissions([]), ctrls.job.updateJob);
router.delete   ('/:jobId', validateAccessToken, checkRequiredPermissions([]), ctrls.job.deleteJob);
router.post     ('/comment/:jobId', validateAccessToken, checkRequiredPermissions([]), ctrls.job.postJobComment);
router.get      ('/comment/:commentId', validateAccessToken, checkRequiredPermissions([]), ctrls.job.showJobComment);
router.put      ('/comment/:commentId', validateAccessToken, checkRequiredPermissions([]), ctrls.job.updateJobComment);
router.delete   ('/comment/:commentId', validateAccessToken, checkRequiredPermissions([]), ctrls.job.deleteJobComment);

module.exports = router;
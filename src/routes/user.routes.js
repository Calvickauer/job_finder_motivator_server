const express = require('express');
const router = express.Router();
const {
    checkRequiredPermissions,
    validateAccessToken,
} = require("../middleware/auth0.middleware.js");
const { Permissions } = require("../security/permissions.js");
const ctrls = require('../controllers');

router.post     ('/seed', validateAccessToken, checkRequiredPermissions([]), ctrls.user.seed);
//user
router.post      ('/login', validateAccessToken, checkRequiredPermissions([]), ctrls.user.login);
router.get      ('/logout', ctrls.user.logout);
router.get      ('/:display_name', validateAccessToken, checkRequiredPermissions([]), ctrls.user.getUser);
 //USE THIS FOR UPDATE/CREATE PROFILE
router.put      ('/update', validateAccessToken, checkRequiredPermissions([]), ctrls.user.updateUserInfo);
router.delete   ('/delete', validateAccessToken, checkRequiredPermissions([]), ctrls.user.deleteUser);

module.exports = router;

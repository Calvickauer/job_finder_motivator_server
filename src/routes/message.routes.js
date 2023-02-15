const express = require('express');
const router = express.Router();
const {
    checkRequiredPermissions,
    validateAccessToken,
} = require("../middleware/auth0.middleware.js");
const { Permissions } = require("../security/permissions.js");
const ctrls = require('../controllers');

// router.post('/seed', validateAccessToken, checkRequiredPermissions([]), ctrls.message.seed);

router.post('/create', validateAccessToken, checkRequiredPermissions([]), ctrls.message.create);
router.get('/index', validateAccessToken, checkRequiredPermissions([]), ctrls.message.index);
router.get('/show/:id', validateAccessToken, checkRequiredPermissions([]), ctrls.message.show);
router.put('/update/:id', validateAccessToken, checkRequiredPermissions([]), ctrls.message.updateMessage);
// router.post('/update/:id/comment', validateAccessToken, checkRequiredPermissions([]), ctrls.message.createComment);
// router.put('/update/:messageId/:commentId', validateAccessToken, checkRequiredPermissions([]), ctrls.message.updateComment);
// router.delete('/update/:messageId/:commentId', validateAccessToken, checkRequiredPermissions([]), ctrls.message.destroyComment);
router.delete('/delete/:id', validateAccessToken, checkRequiredPermissions([]), ctrls.message.destroyMessage);


module.exports = router;
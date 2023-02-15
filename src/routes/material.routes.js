const express = require('express');
const router = express.Router();
const {
    checkRequiredPermissions,
    validateAccessToken,
} = require("../middleware/auth0.middleware.js");
const { Permissions } = require("../security/permissions.js");
const ctrls = require('../controllers');

// router.post('/seed', validateAccessToken, checkRequiredPermissions([]), ctrls.material.seed);

router.post('/create', validateAccessToken, checkRequiredPermissions([]), ctrls.material.create);
router.get('/index', validateAccessToken, checkRequiredPermissions([]), ctrls.material.index);
router.get('/show/:id', validateAccessToken, checkRequiredPermissions([]), ctrls.material.show);
router.put('/update/:id', validateAccessToken, checkRequiredPermissions([]), ctrls.material.updateMaterial);
router.post('/update/:id/comment', validateAccessToken, checkRequiredPermissions([]), ctrls.material.createComment);
router.put('/update/:materialId/:commentId', validateAccessToken, checkRequiredPermissions([]), ctrls.material.updateComment);
router.delete('/update/:materialId/:commentId', validateAccessToken, checkRequiredPermissions([]), ctrls.material.destroyComment);
router.delete('/delete/:id', validateAccessToken, checkRequiredPermissions([]), ctrls.material.destroyMaterial);


module.exports = router;
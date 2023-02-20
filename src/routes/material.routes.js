const express = require('express');
const router = express.Router();
const {
    checkRequiredPermissions,
    validateAccessToken,
} = require("../middleware/auth0.middleware.js");
const { Permissions } = require("../security/permissions.js");
const ctrls = require('../controllers');

// router.post('/seed', validateAccessToken, checkRequiredPermissions([]), ctrls.material.seed);

router.post     ('/', validateAccessToken, checkRequiredPermissions([]), ctrls.material.create);
router.get      ('/', validateAccessToken, checkRequiredPermissions([]), ctrls.material.index);
router.get      ('/:materialId', validateAccessToken, checkRequiredPermissions([]), ctrls.material.show);
router.put      ('/:materialId', validateAccessToken, checkRequiredPermissions([]), ctrls.material.updateMaterial);
router.delete   ('/:materialId', validateAccessToken, checkRequiredPermissions([]), ctrls.material.destroyMaterial);
router.post     ('/comment/:materialId', validateAccessToken, checkRequiredPermissions([]), ctrls.material.createComment);
router.get      ('/comment/:commentId', validateAccessToken, checkRequiredPermissions([]), ctrls.material.showComment);
router.put      ('/comment/:commentId', validateAccessToken, checkRequiredPermissions([]), ctrls.material.updateComment);
router.delete   ('/comment/:commentId', validateAccessToken, checkRequiredPermissions([]), ctrls.material.destroyComment);

module.exports = router;
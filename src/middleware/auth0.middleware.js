const {
  auth,
  claimCheck,
  InsufficientScopeError,
} = require("express-oauth2-jwt-bearer");
const dotenv = require("dotenv");

dotenv.config();

///verify that there is a valid token from auth0 login
const validateAccessToken = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});

///verify that all [requiredPermissions] are in this users token
const checkRequiredPermissions = (requiredPermissions) => {
  return (req, res, next) => {
    const permissionCheck = claimCheck((payload) => {
      const permissions = payload.permissions || [];

      const hasPermissions = requiredPermissions.every((requiredPermission) =>
        permissions.includes(requiredPermission)
      );

      if (!hasPermissions) {
        throw new InsufficientScopeError();
      }

      return hasPermissions;
    });

    permissionCheck(req, res, next);
  };
};

module.exports = {
  validateAccessToken,
  checkRequiredPermissions,
};

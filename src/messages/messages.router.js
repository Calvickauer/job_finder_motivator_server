const express = require("express");
const {
  getAdminMessage,
  getProtectedMessage,
  getPublicMessage,
} = require("./messages.service");
const {
  checkRequiredPermissions,
  validateAccessToken,
} = require("../middleware/auth0.middleware.js");
const { AdminMessagesPermissions } = require("./messages-permissions");

const messagesRouter = express.Router();

messagesRouter.get("/public", (req, res) => {
  const message = getPublicMessage();

  res.status(200).json(message);
});

messagesRouter.get(
  "/protected", 
  validateAccessToken, 
  checkRequiredPermissions([]),
  (req, res) => {
  console.log({user: req.user})
  const message = getProtectedMessage();

  res.status(200).json(message);
});

messagesRouter.get(
  "/admin",
  validateAccessToken,
  checkRequiredPermissions([AdminMessagesPermissions.Read]),
  (req, res) => {
    console.log("in admin message router")
    const message = getAdminMessage();
    console.log({user: req.user})
    res.status(200).json(message);
  }
);

module.exports = { messagesRouter };

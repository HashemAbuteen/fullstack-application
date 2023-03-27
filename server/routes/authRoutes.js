const express = require("express");
const router = express.Router();

module.exports = (controller) => {
  router.post("/register", controller.createUser);
  router.post("/login", controller.logIn);
  router.post("/logout", controller.logout);

  return router;
};

const express = require("express");
const router = express.Router();

module.exports = (controller) => {
  router.post("/register", controller.createUser);
  router.post("/login", controller.logIn);

  return router;
};

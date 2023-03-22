const express = require("express");
const router = express.Router();

module.exports = (controller) => {
  router.post("/register", controller.createUser);
  //   router.post("/register", controller.getTaskById);

  return router;
};

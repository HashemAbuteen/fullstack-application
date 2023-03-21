const express = require("express");
const router = express.Router();

module.exports = (controller) => {
  router.get("/", controller.getAllTasks);
  router.get("/:id", controller.getTaskById);
  router.post("/", controller.createTask);
  router.put("/:id", controller.updateTaskById);
  router.delete("/:id", controller.deleteTaskById);

  return router;
};

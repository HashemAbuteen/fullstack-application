const express = require("express");
const { requireAuth } = require("../controllers/authController");
const router = express.Router();

module.exports = (controller) => {
  router.get("/", requireAuth, controller.getAllTasks);
  router.get("/:id", requireAuth, controller.getTaskById);
  router.post("/", requireAuth, controller.createTask);
  router.put("/:id", requireAuth, controller.updateTaskById);
  router.delete("/:id", requireAuth, controller.deleteTaskById);

  return router;
};

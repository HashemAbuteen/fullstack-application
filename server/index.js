const express = require("express");
const app = express();
const dotenv = require("dotenv").config();

// Middleware for parsing JSON requests and responses
app.use(express.json());

// Import task routes and set up API endpoints
const taskRoutes = require("./routes/taskRoutes");
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTaskById,
  deleteTaskById,
} = require("./controllers/taskController");
app.use(
  "/tasks",
  taskRoutes({
    getAllTasks,
    getTaskById,
    createTask,
    updateTaskById,
    deleteTaskById,
  })
);

// Import auth routes and set up API endpoints
const authRoutes = require("./routes/authRoutes");
const authController = require("./controllers/authController");
app.use("/auth", authRoutes(authController));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;

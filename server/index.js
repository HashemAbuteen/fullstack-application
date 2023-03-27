const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());

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

const authRoutes = require("./routes/authRoutes");
const authController = require("./controllers/authController");
app.use("/auth", authRoutes(authController));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;

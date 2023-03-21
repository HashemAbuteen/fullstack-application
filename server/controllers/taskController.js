const fs = require("fs");
const path = require("path");

const tasksFilePath = path.join(__dirname, "../data/tasks.json");

function readTasksFromFile() {
  const fileContents = fs.readFileSync(tasksFilePath, "utf-8");
  return JSON.parse(fileContents);
}

function writeTasksToFile(tasks) {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
}

/**
 * GET /tasks
 * Get all tasks
 *
 * @returns {object[]} - An array of task objects
 */
function getAllTasks(req, res, next) {
  try {
    const tasks = readTasksFromFile();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /tasks/:id
 * Get a specific task by ID
 *
 * @param {number} id - The ID of the task to retrieve
 * @returns {object} - The task object
 */
function getTaskById(req, res, next) {
  try {
    const tasks = readTasksFromFile();
    const task = tasks.find((task) => task.id === Number(req.params.id));
    if (!task) {
      res.status(404).send("Task not found");
      return;
    }
    res.json(task);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /tasks
 * Create a new task
 *
 * @param {object} body - The task object to create
 * @param {string} body.name - The name of the task
 * @param {boolean} body.completed - Whether the task is completed
 * @returns {object} - The newly created task object
 */
function createTask(req, res, next) {
  try {
    const tasks = readTasksFromFile();
    const { name, completed } = req.body;
    const newTask = {
      id: tasks.length + 1,
      name,
      completed,
    };
    tasks.push(newTask);
    writeTasksToFile(tasks);
    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /tasks/:id
 * Update an existing task by ID
 *
 * @param {number} id - The ID of the task to update
 * @param {object} body - The updated task object
 * @param {string} body.name - The updated name of the task
 * @param {boolean} body.completed - Whether the task is completed
 * @returns {object} - The updated task object
 */
function updateTaskById(req, res, next) {
  try {
    const tasks = readTasksFromFile();
    const task = tasks.find((task) => task.id === Number(req.params.id));
    if (!task) {
      res.status(404).send("Task not found");
      return;
    }
    task.name = req.body.name || task.name;
    task.completed = req.body.completed || task.completed;
    writeTasksToFile(tasks);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /tasks/:id
 * Delete a task by ID
 *
 * @param {number} id - The ID of the task to delete
 */
function deleteTaskById(req, res, next) {
  try {
    const tasks = readTasksFromFile();
    const index = tasks.findIndex((task) => task.id === Number(req.params.id));
    if (index === -1) {
      res.status(404).send("Task not found");
      return;
    }
    tasks.splice(index, 1);
    writeTasksToFile(tasks);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTaskById,
  deleteTaskById,
};

const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv").config();

const uri = `mongodb+srv://hashemabualteen:${process.env.DB_PASS}@cluster0.1bssogr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

async function readTasksFromDB() {
  try {
    await client.connect();
    const db = client.db("mydatabase");
    const tasks = await db.collection("tasks").find().toArray();
    return tasks;
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

async function writeTasksToDB(tasks) {
  try {
    await client.connect();
    const db = client.db("mydatabase");
    await db.collection("tasks").insertMany(tasks);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

async function createTask(req, res, next) {
  try {
    const { name, completed } = req.body;
    const newTask = {
      id: uuidv4(),
      name,
      completed,
    };
    await writeTasksToDB([newTask]);
    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
}

async function getAllTasks(req, res, next) {
  try {
    const tasks = await readTasksFromDB();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

async function getTaskById(req, res, next) {
  try {
    const taskId = req.params.id;
    const query = { id: taskId };
    await client.connect();
    const db = client.db("mydatabase");
    const task = await db.collection("tasks").findOne(query);
    if (!task) {
      res.status(404).send("Task not found");
      return;
    }
    res.json(task);
  } catch (err) {
    next(err);
  } finally {
    await client.close();
  }
}

async function updateTaskById(req, res, next) {
  try {
    const taskId = req.params.id;
    const query = { id: taskId };
    const newTask = {
      name: req.body.name,
      completed: req.body.completed,
    };
    await client.connect();
    const db = client.db("mydatabase");
    const result = await db
      .collection("tasks")
      .updateOne(query, { $set: newTask });
    if (result.matchedCount === 0) {
      res.status(404).send("Task not found");
      return;
    }
    res.json(newTask);
  } catch (err) {
    next(err);
  } finally {
    await client.close();
  }
}

async function deleteTaskById(req, res, next) {
  try {
    const taskId = req.params.id;
    const query = { id: taskId };
    await client.connect();
    const db = client.db("mydatabase");
    const result = await db.collection("tasks").deleteOne(query);
    if (result.deletedCount === 0) {
      res.status(404).send("Task not found");
      return;
    }
    res.sendStatus(204);
  } catch (err) {
    next(err);
  } finally {
    await client.close();
  }
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
};

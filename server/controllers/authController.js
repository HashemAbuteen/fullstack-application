const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const usersFilePath = path.join(__dirname, "../data/users.json");

function readUsersFromFile() {
  const fileContents = fs.readFileSync(usersFilePath, "utf-8");
  return JSON.parse(fileContents);
}

function writeUsersToFile(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

/**
 * POST /auth/register
 * Create a new user
 *
 * @param {object} body - The user object to create
 * @param {string} body.username - Username of the user
 * @param {boolean} body.password - password of the user
 * @returns {object} - The newly created task object
 */
function createUser(req, res, next) {
  console.log("creating a user ... ");
  try {
    const users = readUsersFromFile();
    const { username, password } = req.body;
    const newUser = {
      username,
      password,
    };
    users.push(newUser);
    writeUsersToFile(users);
    res.status(201).json({ username });
  } catch (err) {
    next(err);
  }
}

function logIn(req, res, next) {
  console.log("logging in a user... ");
  try {
    const users = readUsersFromFile();
    const { username, password } = req.body;
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      const token = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 60 * 1000),
      });
      res.status(200).json({ message: `Welcome ${user.username}!` });
    } else {
      res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { createUser, logIn };

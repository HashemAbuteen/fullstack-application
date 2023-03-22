const fs = require("fs");
const path = require("path");

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

module.exports = { createUser };

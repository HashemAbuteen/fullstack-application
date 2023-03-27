const jwt = require("jsonwebtoken");
const client = require("../dbConfig/mongoClient");

const dbName = process.env.DB_NAME;

async function createUser(req, res, next) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection("users");
    const { username, password } = req.body;
    const existingUser = await users.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: "Username already exists" });
      return;
    }
    const newUser = {
      username,
      password,
    };
    await users.insertOne(newUser);
    res.status(201).json({ username });
  } catch (err) {
    next(err);
  } finally {
    await client.close();
  }
}

async function logIn(req, res, next) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection("users");
    const { username, password } = req.body;
    const user = await users.findOne({ username, password });
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
  } finally {
    await client.close();
  }
}

function requireAuth(req, res, next) {
  try {
    if (req.cookies && req.cookies.token) {
      jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          res.status(401).json({ message: "Unauthorized: Invalid token" });
        } else {
          req.user = decoded;
          next();
        }
      });
    } else {
      res.status(401).json({ message: "Unauthorized: Missing token" });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { createUser, logIn, requireAuth };

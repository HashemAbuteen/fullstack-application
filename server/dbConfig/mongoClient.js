const { MongoClient } = require("mongodb");
const dotenv = require("dotenv").config();

const uri = `mongodb+srv://hashemabualteen:${process.env.DB_PASS}@cluster0.1bssogr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

module.exports = client;

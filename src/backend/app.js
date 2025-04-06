const express = require("express");
const app = express(); // ✅ THIS LINE creates the Express app
const cors = require("cors");
const { MongoClient } = require("mongodb");

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json()); // for JSON request bodies

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
const dbName = "Voting-sys";

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    const db = client.db(dbName);

    // 👉 Route inside MongoDB connection to ensure db is available
    app.post("/register", async (req, res) => {
      const { voterId, password } = req.body;

      if (!voterId || !password) {
        return res.status(400).json({ success: false, message: "Voter ID and Password are required." });
      }

      const existingUser = await db.collection("users").findOne({ voterId });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "Voter ID already registered." });
      }

      const result = await db.collection("users").insertOne({ voterId, password });
      res.status(200).json({ success: true, message: "Registration successful!" });
    });
// 🔐 Login Route
app.post("/login", async (req, res) => {
    const { voterId, password } = req.body;
  
    if (!voterId || !password) {
      return res.status(400).json({ success: false, message: "Voter ID and Password are required." });
    }
  
    const user = await db.collection("users").findOne({ voterId });
  
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
  
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid password." });
    }
  
    return res.status(200).json({ success: true, message: "Login successful!" });
  });

  
    
    // Start the server only after DB connection
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

connectToMongoDB();

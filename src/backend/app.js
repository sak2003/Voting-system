const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies sent by clients

// MongoDB connection
const uri = "mongodb://localhost:27017/"; // Default MongoDB URI
const client = new MongoClient(uri);

let db;

// Connect to MongoDB
async function connectToDatabase() {
    try {
        await client.connect();
        db = client.db("Voting-sys"); // Use the correct database name
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if connection fails
    }
}
connectToDatabase();

// API endpoint to handle login form submission
app.post("/submit", async (req, res) => {
    try {
        const { voterId, password } = req.body;

        // Validate input
        if (!voterId || !password) {
            return res.status(400).json({ success: false, message: "Voter ID and Password are required." });
        }

        // Insert data into 'login' collection
        const result = await db.collection("login").insertOne({ voterId, password });
        res.status(200).json({ success: true, message: `Data saved successfully with ID: ${result.insertedId}` });
    } catch (err) {
        console.error("Error saving data:", err);
        res.status(500).json({ success: false, message: "Failed to save data." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
    console.log("Closing MongoDB connection...");
    await client.close();
    process.exit(0);
});

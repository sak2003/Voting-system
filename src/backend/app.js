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


// const express = require("express");
// const cors = require("cors");
// const { MongoClient } = require("mongodb");
// const multer = require("multer"); // For file uploads
// const path = require("path");
// const fs = require("fs");

// const app = express();
// const PORT = 3000;

// // Middleware
// app.use(cors());
// app.use(express.json()); // Parse JSON bodies sent by clients

// // MongoDB connection
// const uri = "mongodb://localhost:27017/"; // Default MongoDB URI
// const client = new MongoClient(uri);

// let db;

// // Connect to MongoDB
// async function connectToDatabase() {
//     try {
//         await client.connect();
//         db = client.db("Voting-sys"); // Use the correct database name
//         console.log("Connected to MongoDB");
//     } catch (err) {
//         console.error("Error connecting to MongoDB:", err);
//         process.exit(1); // Exit if connection fails
//     }
// }
// connectToDatabase();

// // Set up storage for file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadPath = path.join(__dirname, "uploads");
//         if (!fs.existsSync(uploadPath)) {
//             fs.mkdirSync(uploadPath); // Create the directory if it doesn't exist
//         }
//         cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
//     },
// });

// const upload = multer({ storage });

// // API endpoint to handle registration form submission
// app.post("/register", upload.single("fileInput"), async (req, res) => {
//     try {
//         const { voterId, password } = req.body;

//         // Check if the voter ID already exists
//         const existingUser = await db.collection("users").findOne({ voterId });
//         if (existingUser) {
//             return res.status(400).json({ success: false, message: "Voter ID already registered" });
//         }

//         // File path
//         const filePath = req.file ? req.file.path : null;

//         // Validate input
//         if (!voterId || !password || !filePath) {
//             return res.status(400).json({ success: false, message: "All fields are required (Voter ID, Password, File)" });
//         }

//         // Insert data into 'users' collection
//         const result = await db.collection("users").insertOne({ voterId, password, filePath });
//         res.status(200).json({ success: true, message: `User registered successfully with ID: ${result.insertedId}` });
//     } catch (err) {
//         console.error("Error registering user:", err);
//         res.status(500).json({ success: false, message: "Failed to register user" });
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });

// // Graceful shutdown
// process.on("SIGINT", async () => {
//     console.log("Closing MongoDB connection...");
//     await client.close();
//     process.exit(0);
// });

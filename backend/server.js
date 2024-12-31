import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js"; // Import user routes
// import { clerkMiddleware, requireAuth } from "@clerk/express"; // Clerk middleware
import "dotenv/config";
import bodyParser from 'body-parser';
import webhookRoutes from './routes/userWebhook.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure critical environment variables are set
if (!process.env.MONGO_URI || !process.env.SIGNING_SECRET) {
    throw new Error("Error: Missing required environment variables");
}

// // Apply Clerk middleware globally to check for valid sessions
// app.use(clerkMiddleware());

// Middleware to parse JSON data in the request body
app.use(express.json());

// Middleware to parse JSON payloads
app.use(bodyParser.json());

// Register routes
app.use(webhookRoutes);

// User-related routes
app.use("/api/users", userRoutes);

// // Example of a protected route to test Clerk integration
// app.use("/api/protected", requireAuth(), (req, res) => {
//     const { userId } = req.auth; // Clerk user ID from token
//     res.json({ message: `Hello, authenticated user with ID: ${userId}!` });
// });

// Start the server and connect to the database
app.listen(PORT, () => {
    connectDB();
    console.log(`Server started at http://localhost:${PORT}`);
});

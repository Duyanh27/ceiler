import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js"; // Import user routes
import itemRoutes from "./routes/item.route.js";
import { clerkMiddleware, requireAuth } from "@clerk/express"; // Clerk middleware
import "dotenv/config";
import http from "http"; // Required to attach Socket.IO to the server
import { Server } from "socket.io"; // Socket.IO import
import cors from "cors"; // Import CORS

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create an HTTP server instance
const server = http.createServer(app);

// Set up Socket.IO with the server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity; configure this as needed
  },
});

// Apply Clerk middleware globally to check for valid sessions
app.use(clerkMiddleware());

// Middleware to parse JSON data in the request body
app.use(express.json());

// Socket.IO Connection
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Allow only your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
    credentials: true, // Allow cookies if needed
  })
);

// User-related routes
app.use("/api/users", userRoutes);

// Item-related routes
app.use(
  "/api/items",
  (req, res, next) => {
    req.io = io; // Attach the Socket.IO instance to the request object
    next();
  },
  itemRoutes
);

// Example of a protected route to test Clerk integration
app.use("/api/protected", requireAuth(), (req, res) => {
  const { userId } = req.auth; // Clerk user ID from token
  res.json({ message: `Hello, authenticated user with ID: ${userId}!` });
});

// Start the server and connect to the database
server.listen(PORT, () => {
  connectDB();
  console.log(`Server started at http://localhost:${PORT}`);
});

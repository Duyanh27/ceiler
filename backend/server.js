import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js"; // Import user routes
import itemRoutes from "./routes/item.route.js";
import categoryRoutes from "./routes/category.route.js";
import webhookRoutes from "./routes/webhook.route.js";
import { clerkMiddleware, requireAuth } from "@clerk/express"; // Clerk middleware
import "dotenv/config";
import http from "http"; // Required to attach Socket.IO to the server
import { Server } from "socket.io"; // Socket.IO import
import cors from "cors"; // Import CORS
import cron from "node-cron"; // Import cron
import Item from "../backend/models/item.model.js";


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

// Important: Place webhook routes before any middleware that parses the body
app.use("/api/webhooks", webhookRoutes);

// Apply Clerk middleware globally to check for valid sessions
app.use((req, res, next) => {
  if (req.path === "/api/webhooks") {
    return next();
  }
  return clerkMiddleware()(req, res, next);
});

// Middleware to parse JSON data in the request body
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Allow only your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
    credentials: true, // Allow cookies if needed
  })
);

// Socket.IO Connection
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const expiredAuctions = await Item.find({
      endTime: { $lte: now },
      status: "active",
    });

    for (const auction of expiredAuctions) {
      auction.status = "completed";
      await auction.save();
      console.log(`Auction ${auction._id} ended.`);
    }
  } catch (error) {
    console.error("Error processing expired auctions:", error.message);
  }
});

// User-related routes
app.use("/api/users", userRoutes);

app.use("/getTime", (req, res) => {
  console.log(new Date());
  res.json({ message: new Date() });
});

// Item-related routes
app.use(
  "/api/items",
  (req, res, next) => {
    req.io = io; // Attach the Socket.IO instance to the request object
    next();
  },
  itemRoutes
);

app.use("/api/categories", categoryRoutes);

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

import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import itemRoutes from "./routes/item.route.js";
import categoryRoutes from "./routes/category.route.js";
import webhookRoutes from "./routes/webhook.route.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create an HTTP server instance
const server = http.createServer(app);

// CORS configuration
const allowedOrigins = ["http://localhost:3000"];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

// Webhooks route
app.use("/api/webhooks", webhookRoutes);

// Clerk middleware
app.use((req, res, next) => {
  if (req.path === "/api/webhooks") {
    return next();
  }
  return clerkMiddleware()(req, res, next);
});

// Middleware to parse JSON data
app.use(express.json());

// Socket.IO connection events
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("place-bid", (data) => {
    console.log("Bid received:", data);
    io.emit("auction-updated", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Routes
app.use("/api/users", userRoutes);
app.use(
  "/api/items",
  (req, res, next) => {
    req.io = io;
    next();
  },
  itemRoutes
);
app.use("/api/categories", categoryRoutes);

app.use("/api/protected", requireAuth(), (req, res) => {
  const { userId } = req.auth;
  res.json({ message: `Hello, authenticated user with ID: ${userId}!` });
});

// Start server
server.listen(PORT, () => {
  connectDB();
  console.log(`Server started at http://localhost:${PORT}`);
});

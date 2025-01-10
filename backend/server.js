// Core imports
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

// Configuration imports
import { connectDB } from "./config/db.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";

// Route imports
import userRoutes from "./routes/user.route.js";
import itemRoutes from "./routes/item.route.js";
import webhookRoutes from "./routes/webhook.route.js";

// Socket.IO
import { Server } from "socket.io";

// Load environment variables
dotenv.config();

// Initialize Express and create HTTP server
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity
  },
});

// Socket.IO Connection Handler
io.on("connection", (socket) => {
  console.log("A user connected");
  
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Middleware Configuration
// 1. Webhooks (must be before body parser)
app.use("/api/webhooks", webhookRoutes);

// 2. Global Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// 3. Clerk Authentication (except webhooks)
app.use((req, res, next) => {
  if (req.path === '/api/webhooks') {
    return next();
  }
  return clerkMiddleware()(req, res, next);
});

// Route Configuration
// 1. API Routes
app.use("/api/users", userRoutes);
app.use("/api/items", attachIO, itemRoutes);
app.use("/api/protected", requireAuth(), handleProtectedRoute);

// Start Server
server.listen(PORT, () => {
  connectDB();
  console.log(`Server started at http://localhost:${PORT}`);
});

// Middleware Functions
function attachIO(req, res, next) {
  req.io = io;
  next();
}

function handleProtectedRoute(req, res) {
  const { userId } = req.auth;
  res.json({ 
    message: `Hello, authenticated user with ID: ${userId}!` 
  });
}
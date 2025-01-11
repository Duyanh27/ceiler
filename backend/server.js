// server.js
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';

// Configuration imports
import { connectDB } from "./config/db.js";

// Route imports
import userRoutes from "./routes/user.route.js";
import itemRoutes from "./routes/item.route.js";
import categoryRoutes from "./routes/category.route.js";
import webhookRoutes from "./routes/webhook.route.js";
import cron from "node-cron"; // Import cron
import Item from "../backend/models/item.model.js";


// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// JWT Verification Middleware
const verifyClerkJWT = async (req, res, next) => {
  try {
    console.log("🔐 Verifying JWT...");
    
    // Check for Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No Bearer token found");
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("🎟️ Token received:", token);

    // Check for Clerk PEM public key
    const publicKey = process.env.CLERK_PEM_PUBLIC_KEY;
    if (!publicKey) {
      console.error("❌ No public key found");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Verify the JWT
    let decoded;
    try {
      decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
      console.log("✅ Token decoded:", decoded);
    } catch (error) {
      console.error("❌ JWT verification failed:", error.message);
      return res.status(401).json({ message: "Invalid token", error: error.message });
    }

    // Validate userId format
    const userId = decoded.sub;
    const isValidUserId = /^user_[a-zA-Z0-9]+$/.test(userId);
    if (!isValidUserId) {
      console.error("❌ Invalid user ID format:", userId);
      return res.status(400).json({ message: "Invalid user ID format hehe" });
    }

    // Attach userId to req.auth
    req.auth = { userId };
    console.log("🔑 Authenticated user ID:", req.auth.userId);

    next();
  } catch (error) {
    console.error("❌ Middleware error:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Middleware
const allowedOrigins = ["http://localhost:3000", "http://localhost:8080"];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));


// Debug middleware
app.use((req, res, next) => {
    if (req.path === '/api/webhooks') {
        return next();
    }
    return clerkMiddleware()(req, res, next);
});

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

// Start Server
server.listen(PORT, async () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
  try {
    await connectDB();
    console.log('📦 Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
});
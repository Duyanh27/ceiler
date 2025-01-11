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
import webhookRoutes from "./routes/webhook.route.js";

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
  console.log('\n🔄 Incoming Request:');
  console.log('📍 URL:', req.url);
  console.log('📍 Method:', req.method);
  console.log('🔑 Headers:', req.headers);
  next();
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: "Server is running" });
});

// Routes
app.use("/api/webhooks", webhookRoutes);
app.use("/api/users", verifyClerkJWT, (req, res, next) => {
  console.log("🔍 Middleware transfer check: req.auth:", req.auth);
  next();
}, userRoutes);
app.use("/api/items", verifyClerkJWT, itemRoutes);

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
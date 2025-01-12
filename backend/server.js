// Core Dependencies
import express from "express";
import http from "http";
import dotenv from "dotenv";
import "dotenv/config";

// Third Party Dependencies
import cors from "cors";
import { Server } from "socket.io";
import cron from "node-cron";
import jwt from 'jsonwebtoken';
import { clerkMiddleware, requireAuth } from "@clerk/express";

// Local Imports - Configuration
import { connectDB } from "./config/db.js";

// Local Imports - Routes
import userRoutes from "./routes/user.route.js";
import itemRoutes from "./routes/item.route.js";
import categoryRoutes from "./routes/category.route.js";
import webhookRoutes from "./routes/webhook.route.js";

// Local Imports - Models
import Item from "./models/item.model.js";

// Initialize Environment Variables
dotenv.config();

// App Configuration
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Socket.IO Configuration
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// CORS Configuration
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:8080"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// Debug Middleware
const debugMiddleware = (req, res, next) => {
  console.log('\n🔄 Incoming Request:');
  console.log('📍 URL:', req.url);
  console.log('📍 Method:', req.method);
  console.log('🔑 Headers:', req.headers);
  next();
};

// JWT Verification Middleware
const verifyClerkJWT = async (req, res, next) => {
  try {
    console.log("🔐 Verifying JWT...");
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No Bearer token found");
      return res.status(401).json({ message: "No token provided" });
    }
    
    const token = authHeader.split(" ")[1];
    console.log("🎟️ Token received:", token);
    
    const publicKey = process.env.CLERK_PEM_PUBLIC_KEY;
    if (!publicKey) {
      console.error("❌ No public key found");
      return res.status(500).json({ message: "Server configuration error" });
    }
    
    try {
      const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
      console.log("✅ Token decoded:", decoded);
      
      const userId = decoded.sub;
      const isValidUserId = /^user_[a-zA-Z0-9]+$/.test(userId);
      if (!isValidUserId) {
        console.error("❌ Invalid user ID format:", userId);
        return res.status(400).json({ message: "Invalid user ID format" });
      }
      
      req.auth = { userId };
      console.log("🔑 Authenticated user ID:", req.auth.userId);
      next();
    } catch (error) {
      console.error("❌ JWT verification failed:", error.message);
      return res.status(401).json({ message: "Invalid token", error: error.message });
    }
  } catch (error) {
    console.error("❌ Middleware error:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Socket.IO Event Handlers
const setupSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected");
    
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

// Cron Job Configuration
const setupCronJobs = () => {
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
};

// Middleware to attach Socket.IO to request
const attachIO = (req, res, next) => {
  req.io = io;
  next();
};

// Middleware Setup
const setupMiddleware = () => {
  // Webhook routes must be before any other middleware
  app.use("/api/webhooks", webhookRoutes);
  
  // Other middleware comes after webhooks
  app.use((req, res, next) => {
      if (req.path.startsWith('/api/webhooks')) {
          return next();
      }
      return clerkMiddleware()(req, res, next);
  });
  
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(debugMiddleware);
};

// Route Setup
const setupRoutes = () => {
  // Test route
  app.get('/test', (req, res) => {
    res.json({ message: "Server is running" });
  });

  // Time route
  app.get("/getTime", (req, res) => {
    console.log(new Date());
    res.json({ message: new Date() });
  });

  // Protected API routes
  app.use("/api/users", verifyClerkJWT, (req, res, next) => {
    console.log("🔍 Middleware transfer check: req.auth:", req.auth);
    next();
  }, userRoutes);
  
  app.use("/api/items", verifyClerkJWT, attachIO, itemRoutes);
  app.use("/api/categories", verifyClerkJWT, categoryRoutes);
  
  // Protected route example
  app.use("/api/protected", requireAuth(), (req, res) => {
    const { userId } = req.auth;
    res.json({ message: `Hello, authenticated user with ID: ${userId}!` });
  });
};

// Server Initialization
const startServer = async () => {
  try {
    // Setup all components
    setupMiddleware();
    setupRoutes();
    setupSocketIO(io);
    setupCronJobs();

    // Connect to database and start server
    await connectDB();
    console.log('📦 Connected to MongoDB');

    server.listen(PORT, () => {
      console.log(`🚀 Server started at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server initialization error:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
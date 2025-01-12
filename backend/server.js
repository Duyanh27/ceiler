// Core Dependencies
import express from "express";
import http from "http";
import dotenv from "dotenv";
import "dotenv/config";

// Third Party Dependencies
import cors from "cors";
import { Server } from "socket.io";
import cron from "node-cron";
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

// Local middleware
import { verifyClerkJWT } from "./middleware/auth.middleware.js";

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
  // Webhook routes must be before body parser
  app.use("/api/webhooks", webhookRoutes);
  
  // Global Clerk middleware except for webhooks
  app.use((req, res, next) => {
    if (req.path === "/api/webhooks") {
      return next();
    }
    return clerkMiddleware()(req, res, next);
  });
  
  app.use(express.json());
  app.use(cors(corsOptions));
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
  
  app.use("/api/items", attachIO, itemRoutes);
  app.use("/api/categories", categoryRoutes);
  
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
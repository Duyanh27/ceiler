import express from "express";
import './config/env.js';  // Import this first
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from '@clerk/express';
import cors from 'cors';

// Route imports
import itemRoutes from "./routes/item.route.js";
import userRoutes from "./routes/user.route.js";
import bidRoutes from "./routes/bid.route.js";
import webhookRoutes from './routes/userWebhook.route.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/webhook', webhookRoutes);

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'API is working' });
});

// Start server
app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on http://localhost:${PORT}`);
});
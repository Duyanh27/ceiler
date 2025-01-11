// routes/user.route.js
import express from "express";
import {
  getUserById,
  getOwnProfile,
  addFundsToWallet,
  clearNotifications,
  markNotificationsAsRead,
  markNotificationAsRead,
} from "../controller/user.controller.js";

const router = express.Router();

// Protected routes - auth is handled by middleware in server.js
router.get('/profile', (req, res, next) => {
  console.log("➡️ req.auth in /profile route:", req.auth);
  next();
}, getOwnProfile);

// Public routes
router.get("/:id", getUserById);
router.post("/wallet/add", addFundsToWallet);
router.delete("/notifications", clearNotifications);
router.put("/notifications/read", markNotificationsAsRead);
router.put("/notification/read", markNotificationAsRead);

export default router;
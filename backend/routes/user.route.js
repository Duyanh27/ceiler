import express from "express";
import {
  getUserById,
  addFundsToWallet,
  clearNotifications,
  markNotificationsAsRead,
} from "../controller/user.controller.js";

const router = express.Router();

// All routes public for testing
router.get("/:id", getUserById);
router.post("/wallet/add", addFundsToWallet);
router.delete("/notifications", clearNotifications);
router.put("/notifications/read", markNotificationsAsRead);

export default router;
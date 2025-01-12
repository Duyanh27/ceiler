import express from "express";
import {
  getUserById,
  getOwnProfile,
  addFundsToWallet,
  clearNotifications,
  markNotificationsAsRead,
  markNotificationAsRead,
} from "../controller/user.controller.js";
import { verifyClerkJWT } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js"; // Import the User model


const router = express.Router();

// Public route for fetching user name by Clerk ID
router.get("/public/getUserName/:clerkId", async (req, res) => {
  try {
    const { clerkId } = req.params;
    console.log("Received clerkId:", clerkId); // Log the clerkId
    if (!clerkId) {
      return res.status(400).json({ message: "Clerk ID is required" });
    }
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ username: user.username });
  } catch (error) {
    console.error("Error fetching user name:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Protected routes
router.get("/profile", verifyClerkJWT, getOwnProfile);

// Other routes
router.get("/:id", getUserById);
router.post("/wallet/add", addFundsToWallet);
router.delete("/notifications", clearNotifications);
router.put("/notifications/read", markNotificationsAsRead);
router.put("/notification/read", markNotificationAsRead);

export default router;

import express from "express";
import {
  getAllUsers,
  getUserByClerkId,
  syncUser,
  updateWalletBalance,
  deleteUser,
} from "../controller/user.controller.js";

const router = express.Router();

// Admin-only routes
router.get("/", getAllUsers); // Fetch all users (no auth for testing)
router.delete("/:id", deleteUser); // Delete a user by ID (no auth for testing)

// User-specific routes
router.get("/me", getUserByClerkId); // Get current user (no auth for testing)
router.post("/sync", syncUser); // Sync user from Clerk (no auth for testing)
router.put("/wallet", updateWalletBalance); // Update wallet balance (no auth for testing)

export default router;

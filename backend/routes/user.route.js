import express from "express";
import { requireAuth } from "@clerk/express"; // Import Clerk-provided middleware
import {
  getAllUsers,
  getUserByClerkId,
  syncUser,
  updateWalletBalance,
  deleteUser,
} from "../controller/user.controller.js";

const router = express.Router();

// Admin-only routes
router.get("/", requireAuth(), getAllUsers); // Fetch all users (admin-only)
router.delete("/:id", requireAuth(), deleteUser); // Delete a user by ID (admin-only)

// User-specific routes
router.get("/me", requireAuth(), getUserByClerkId); // Get current user
router.post("/sync", requireAuth(), syncUser); // Sync user from Clerk
router.put("/wallet", requireAuth(), updateWalletBalance); // Update wallet balance

export default router;

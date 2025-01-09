import express from "express";
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  bidItem,
} from "../controller/item.controller.js";
import { requireAuth } from "@clerk/express";

const router = express.Router();

// Define routes
router.get("/", getAllItems); // Get all items
router.get("/:id", getItemById); // Get item by ID
router.post("/", createItem); // Create a new item
router.put("/:id", updateItem); // Update an item by ID
router.delete("/:id", deleteItem); // Delete an item by ID

// Bidding route - Ensure the `io` instance is passed
router.post("/auctions/:id/bid", requireAuth(), (req, res) => {
  const io = req.io; // Access the `io` instance attached in middleware
  bidItem(io)(req, res); // Pass `io` to the `bidItem` controller
});

export default router;

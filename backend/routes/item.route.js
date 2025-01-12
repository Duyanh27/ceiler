import express from "express";
import { verifyClerkJWT } from "../middleware/auth.middleware.js";
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  bidItem,
} from "../controller/item.controller.js";

const router = express.Router();

// Define routes
router.get("/getAllItem", getAllItems); // Get all items
router.get("/getOneItem/:id", getItemById); // Get item by ID
router.post("/addItem", verifyClerkJWT, createItem); // Create a new item
router.delete("/:id", deleteItem); // Delete an item by ID

// Bidding route - Ensure the `io` instance is passed
router.post("/auctions/:id/bid", verifyClerkJWT, (req, res) => {
  const io = req.io; // Access the `io` instance attached in middleware
  bidItem(io)(req, res); // Pass `io` to the `bidItem` controller
});

export default router;

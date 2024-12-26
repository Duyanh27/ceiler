import express from "express";
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/itemController.js";

const router = express.Router();

// Define routes
router.get("/", getAllItems); // Get all items
router.get("/:id", getItemById); // Get item by ID
router.post("/", createItem); // Create a new item
router.put("/:id", updateItem); // Update an item by ID
router.delete("/:id", deleteItem); // Delete an item by ID

export default router;
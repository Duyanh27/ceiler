import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

// Define routes
router.get("/", getAllCategories); // Get all categories
router.get("/:id", getCategoryById); // Get a category by ID
router.post("/", createCategory); // Create a new category  
router.put("/:id", updateCategory); // Update a category by ID
router.delete("/:id", deleteCategory); // Delete a category by ID

export default router;
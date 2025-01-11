import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controller/category.controller.js";

const router = express.Router();

// Define routes
router.get("/getCategory", getAllCategories); // Get all categories
router.get("/getCategoryById/:id", getCategoryById); // Get a category by ID
router.post("/addCategory", createCategory); // Create a new category  
router.put("/updCategoryById/:id", updateCategory); // Update a category by ID
router.delete("/delCategoryById/:id", deleteCategory); // Delete a category by ID

export default router;
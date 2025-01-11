import Category from "../models/category.model.js";


export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // Retrieve all categories
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id); // Find category by ID
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { _id, parentCategory = null } = req.body; // Default parentCategory to null

    // Check if a category with the same name already exists
    const existingCategory = await Category.findOne({ _id });
    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Category with this name already exists" });
    }

    const createdAt = new Date();

    // Initialize the new category
    const newCategory = new Category({ _id, parentCategory, createdAt });

    // If there's a parent category, ensure it exists
    if (parentCategory) {
      const parent = await Category.findById(parentCategory);
      if (!parent) {
        return res
          .status(400)
          .json({
            message: `Parent category with ID ${parentCategory} does not exist.`,
          });
      }

      // Ensure the parent is a top-level category (no parent itself)
      if (parent.parentCategory) {
        return res
          .status(400)
          .json({
            message:
              "Cannot assign parent category that is already a child category.",
          });
      }

      // Set the path dynamically based on the parent
      newCategory.path = `${parent.path}/${_id}`;
    } else {
      // If no parent, set the path as the category's own name
      newCategory.path = `${_id}`;
    }
    
    // Save the new category to the database
    try {
      await newCategory.save();
    } catch (error) {
      console.error("Save operation failed:", error.message);
      return res.status(500).json({ message: "Save operation failed", error });
    }
    
    res
      .status(201)
      .json({
        message: "Category created successfully",
        category: newCategory,
      });
  } catch (error) {
    console.error("Error creating category:", error.message); // Log the error for debugging
    res.status(500).json({ message: "Error creating category", error });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res
      .status(200)
      .json({
        message: "Category updated successfully",
        category: updatedCategory,
      });
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};
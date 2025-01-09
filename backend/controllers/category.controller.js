import Category from "../models/category.model.js";

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find()
            .sort('name')
            .select('_id name parentCategory path');
            
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error: error.message });
    }
};

export const getSubcategories = async (req, res) => {
    try {
        const parentId = req.query.parentId || null;
        
        if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
            return res.status(400).json({ message: "Invalid parent category ID" });
        }

        const categories = await Category.find({ parentCategory: parentId })
            .sort('name')
            .select('_id name path');
            
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching subcategories", error: error.message });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid category ID" });
        }

        const category = await Category.findById(req.params.id)
            .select('_id name parentCategory path');
            
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: "Error fetching category", error: error.message });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { _id, name, parentCategory } = req.body;

        if (!name || name.trim().length < 2 || name.trim().length > 50) {
            return res.status(400).json({ 
                message: "Category name must be between 2 and 50 characters" 
            });
        }

        // Check for duplicate name in same level
        const existingCategory = await Category.findOne({ 
            name: name.trim(), 
            parentCategory: parentCategory || null 
        });
        
        if (existingCategory) {
            return res.status(400).json({ 
                message: "Category with this name already exists at this level" 
            });
        }

        // Check for circular reference
        if (parentCategory) {
            const parent = await Category.findById(parentCategory);
            if (!parent) {
                return res.status(404).json({ message: "Parent category not found" });
            }

            let currentParent = parent;
            while (currentParent.parentCategory) {
                if (currentParent.parentCategory === _id) {
                    return res.status(400).json({ 
                        message: "Circular reference detected in category hierarchy" 
                    });
                }
                currentParent = await Category.findById(currentParent.parentCategory);
            }
        }

        let path = name.trim();
        if (parentCategory) {
            const parent = await Category.findById(parentCategory);
            if (parent) {
                path = parent.path ? `${parent.path}/${name.trim()}` : name.trim();
            }
        }

        const newCategory = await Category.create({
            _id,
            name: name.trim(),
            parentCategory,
            path
        });

        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: "Error creating category", error: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const categoryId = req.params.id;

        if (!name || name.trim().length < 2 || name.trim().length > 50) {
            return res.status(400).json({ 
                message: "Category name must be between 2 and 50 characters" 
            });
        }

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ message: "Invalid category ID" });
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const existingCategory = await Category.findOne({
            name: name.trim(),
            parentCategory: category.parentCategory,
            _id: { $ne: categoryId }
        });

        if (existingCategory) {
            return res.status(400).json({ 
                message: "Category with this name already exists at this level" 
            });
        }

        category.name = name.trim();
        await category.save();

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: "Error updating category", error: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid category ID" });
        }

        const hasSubcategories = await Category.exists({ 
            parentCategory: req.params.id 
        });

        if (hasSubcategories) {
            return res.status(400).json({ 
                message: "Cannot delete category with subcategories" 
            });
        }

        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting category", error: error.message });
    }
};
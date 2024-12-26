import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Unique category ID
    name: { type: String, required: true, unique: true, trim: true }, // Category name
    description: { type: String, trim: true, default: '' } // Category description
  }, { timestamps: true });

// Index for faster searches by category name
categorySchema.index({ name: 1 });

const Category = mongoose.model('Category', categorySchema);

export default Category;
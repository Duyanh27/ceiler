import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    _id: { type: String, required: true, trim: true}, // Unique ID for the category
    parentCategory: {
      type: String,
      ref: 'Category', // Reference to another Category
      default: null, // Null for top-level categories
    },
    path: { type: String, required: true, trim: true}, // Full category path (e.g., "Electronics/Smartphones")
    createdAt: { 
      type: Date, 
      required: true,
      index: true
  },
  },

);

// Indexes for faster lookups
categorySchema.index({ name: 1, parentCategory: 1 });
categorySchema.index({ path: 1 });

// Middleware to enforce 2-level hierarchy and generate path
categorySchema.pre('save', async function (next) {
  if (this.parentCategory) {
    const parent = await this.constructor.findById(this.parentCategory);

    // Ensure the parent exists
    if (!parent) {
      throw new Error(`Parent category with ID ${this.parentCategory} does not exist.`);
    }

    // Ensure the parent is a top-level category (no parent itself)
    if (parent.parentCategory) {
      throw new Error(
        `Cannot assign parent category ${this.parentCategory}, as it is already a child category.`
      );
    }

    // Set the path
    this.path = `${parent._id}/${this._id}`;
  } else {
    // Top-level category (no parent)
    this.path = this._id;
  }

  next();
});

const Category = mongoose.model('Category', categorySchema);

export default Category;

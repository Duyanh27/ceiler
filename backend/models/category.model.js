import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    parentCategory: { 
        type: String, 
        ref: 'Category',
        default: null
    },
    path: { type: String } // Stores full category path for hierarchy queries
}, { 
    timestamps: true 
});

// Indexes for faster category lookups and hierarchy traversal
categorySchema.index({ name: 1, parentCategory: 1 });
categorySchema.index({ path: 1 });

// Automatically generates category paths
categorySchema.pre('save', async function(next) {
    if (this.parentCategory) {
        const parent = await this.constructor.findById(this.parentCategory);
        if (parent) {
            this.path = parent.path ? `${parent.path}/${this.name}` : this.name;
        }
    } else {
        this.path = this.name;
    }
    next();
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
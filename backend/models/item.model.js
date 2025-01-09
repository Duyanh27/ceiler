import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Unique item ID
    title: { type: String, required: true }, // Item title
    description: { type: String }, // Description of the item
    startingPrice: { type: Number, required: true }, // Starting price
    currentPrice: { type: Number, required: true, default: function() { return this.startingPrice; } }, // Current highest bid
    imageUrl: { type: String }, // Image URL
    category: { type: String, required: true, ref: 'Category' }, // Reference to Category
    createdBy: { type: String, required: true, ref: 'User' }, // User who created the auction
    endTime: { type: Date, required: true, index: true }, // Auction end time
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' }, // Auction status
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }, { timestamps: true });
  
  // Index for filtering by category and sorting by endTime
  itemSchema.index({ category: 1, endTime: 1 });
  
  // Index for searching items by their status
  itemSchema.index({ status: 1 });
  
  const Item = mongoose.model('Item', itemSchema);

  export default Item;
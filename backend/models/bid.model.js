import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'User' }, // User who placed the bid
    itemId : { type: String, required: true, ref: 'Item' },
    amount: { type: Number, required: true }, // Bid amount
    timestamp: { type: Date, default: Date.now } // Time of the bid
  }, { timestamps: true });

// Index for faster searches by category name
bidSchema.index({ itemId : 1 });

const Bid = mongoose.model('Bid', bidSchema);

export default Bid;


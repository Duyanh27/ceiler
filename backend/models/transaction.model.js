import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Transaction ID
    userId: { type: String, required: true, ref: 'User', index: true }, // Reference to the user
    type: { type: String, enum: ['credit', 'debit'], required: true }, // Transaction type
    amount: { type: Number, required: true }, // Transaction amount
    description: { type: String }, // Transaction description
    timestamp: { type: Date, default: Date.now } // Transaction timestamp
}, { timestamps: true });
  
 // Index for filtering transactions by type
transactionSchema.index({ type: 1 });

// Index for sorting transactions by timestamp
transactionSchema.index({ timestamp: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
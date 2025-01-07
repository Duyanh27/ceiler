import mongoose from 'mongoose';

const itemBidSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    userId: { type: String, required: true, ref: 'User' },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['active', 'won', 'outbid'],
        default: 'active'
    },
    timestamp: { type: Date, default: Date.now }
}, { _id: false });

const itemSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    startingPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    imageUrl: { type: String },
    categories: [{
        type: String,
        ref: 'Category',
        required: true
    }],
    createdBy: { type: String, required: true, ref: 'User' },
    endTime: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['active', 'completed', 'cancelled'], 
        default: 'active' 
    },
    bids: [itemBidSchema], // Array of recent/active bids
    winningBid: {
        type: String,
        ref: 'Bid'
    },
    totalBids: { // Counter for total number of bids
        type: Number,
        default: 0
    },
    highestBid: { // Reference to highest bid in Bid collection
        type: String,
        ref: 'Bid'
    }
}, { 
    timestamps: true 
});

itemSchema.index({ categories: 1, endTime: 1 });
itemSchema.index({ status: 1 });
itemSchema.index({ createdBy: 1 });
itemSchema.index({ 'bids.userId': 1 });
itemSchema.index({ 'bids.amount': -1 });

const Item = mongoose.model('Item', itemSchema);
export default Item;
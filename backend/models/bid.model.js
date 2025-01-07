import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    itemId: { 
        type: String, 
        required: true, 
        ref: 'Item',
        index: true
    },
    userId: { 
        type: String, 
        required: true, 
        ref: 'User',
        index: true
    },
    amount: { 
        type: Number, 
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['active', 'won', 'outbid', 'cancelled'],
        default: 'active',
        index: true
    }
}, { 
    timestamps: true 
});

bidSchema.index({ itemId: 1, amount: -1 });
bidSchema.index({ itemId: 1, userId: 1 });

const Bid = mongoose.model('Bid', bidSchema);
export default Bid;

// Example bid creation middleware
bidSchema.pre('save', async function(next) {
    try {
        const item = await Item.findById(this.itemId);
        if (!item) throw new Error('Item not found');

        // Update item's bids array (keep last 10 bids)
        const newItemBid = {
            _id: this._id,
            userId: this.userId,
            amount: this.amount,
            status: this.status,
            timestamp: new Date()
        };

        item.bids.unshift(newItemBid);
        item.bids = item.bids.slice(0, 10); // Keep only last 10 bids
        item.totalBids += 1;
        
        if (!item.highestBid || this.amount > item.currentPrice) {
            item.currentPrice = this.amount;
            item.highestBid = this._id;
        }

        await item.save();
        next();
    } catch (error) {
        next(error);
    }
});
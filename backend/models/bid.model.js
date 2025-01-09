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
        min: 0,
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
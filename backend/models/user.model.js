import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    type: {
        type: String,
        enum: ["bidOutbid", "bidWon", "auctionEnding", "walletUpdated"],
        required: true
    },
    relatedItemId: { type: String, ref: 'Item' }, // Reference to related item
    relatedBidId: { type: String, ref: 'Bid' },   // Reference to related bid
    timestamp: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."]
    },
    username: { 
        type: String, 
        required: true 
    },
    walletBalance: { 
        type: Number, 
        default: 0,
        min: 0 // Prevent negative balance
    },
    activeBids: [{ 
        type: String, 
        ref: 'Bid' 
    }],
    wonAuctions: [{ 
        type: String, 
        ref: 'Item' 
    }],
    notifications: [notificationSchema]
}, { 
    timestamps: true,
    // Add helpful virtuals
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add virtual for total active bids amount
userSchema.virtual('totalActiveBidsAmount').get(function() {
    return this.activeBids.reduce((sum, bid) => sum + bid.amount, 0);
});

// Indexes for common queries
// userSchema.index({ clerkId: 1 });
// userSchema.index({ email: 1 });
userSchema.index({ 'notifications.isRead': 1 });

const User = mongoose.model("User", userSchema);
export default User;
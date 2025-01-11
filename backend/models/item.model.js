import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    startingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: { type: String },
    categories: [
      {
        type: String,
        ref: "Category",
        required: true,
      },
    ],
    createdBy: {
      type: String,
      required: true,
      ref: "User",
    },
    endTime: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
      index: true,
    },
    highestBid: {
      bidId: { type: String, ref: "Bid" },
      amount: { type: Number },
      userId: { type: String, ref: "User" },
      timestamp: { type: Date },
    },
    totalBids: {
      type: Number,
      default: 0,
    },
    winner: {
      type: String,
      ref: "User",
    },
    createdAt: {
      type: Date,
      required: true,
      index: true,
    },
    updatedAt: {
      type: Date,
      required: true,
      index: true,
    },
  }
);

itemSchema.index({ categories: 1, endTime: 1 });
// itemSchema.index({ status: 1 });
itemSchema.index({ createdBy: 1 });
itemSchema.index({ "bids.userId": 1 });
itemSchema.index({ "bids.amount": -1 });

const Item = mongoose.model("Item", itemSchema);
export default Item;

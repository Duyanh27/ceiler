import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Notification ID
  message: { type: String, required: true }, // Notification content
  isRead: { type: Boolean, default: false }, // Read status
  type: {
    type: String,
    enum: ["bidUpdate", "auctionEnding"],
    required: true,
  }, // Notification type
  timestamp: { type: Date, default: Date.now }, // Notification timestamp
});

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true, // This already creates an index in Mongoose
    }, // Clerk user ID
    email: {
      type: String,
      required: true,
      unique: true, // This also creates an index in Mongoose
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    }, // Email address
    name: { type: String, required: true }, // User name
    walletBalance: { type: Number, default: 0 }, // Wallet balance
    role: {
      type: String,
      enum: ["user", "mod"],
      default: "user",
    }, // Role: user or mod
    notifications: [notificationSchema], // Embedded notifications
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Remove this line if clerkId already has `unique: true`:
// userSchema.index({ clerkId: 1 }); // NOT needed if `unique` is defined above

const User = mongoose.model("User", userSchema);

export default User;

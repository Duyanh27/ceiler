import User from "../models/user.model.js";
import mongoose from "mongoose";

// Get user by ID (for public profile viewing)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.params.id }).select("name");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

// View own profile with Clerk auth
export const getOwnProfile = async (req, res) => {
  try {
    // Log the clerkId being used
    console.log("🔍 Looking up profile with clerkId:", req.auth?.userId);

    // Ensure userId is valid
    if (!req.auth?.userId) {
      console.error("❌ Missing userId in req.auth");
      return res.status(400).json({ message: "Invalid or missing user ID" });
    }

    // Execute the query
    const user = await User.findOne({ clerkId: req.auth.userId })
      .select(
        "username email imageUrl walletBalance activeBids wonAuctions notifications"
      )
      .populate("activeBids", "amount status")
      .populate("wonAuctions", "title status");

    console.log("🔍 User found:", user ? "Yes" : "No");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user profile
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error in getOwnProfile:", error.message);
    res.status(500).json({
      message: "Error fetching user profile",
      error: error.message,
    });
  }
};

// Add funds to wallet  
export const addFundsToWallet = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

    try {
        const { amount } = req.body;
        const clerkId = req.auth.userId; // Get clerkId from auth

    if (!amount || typeof amount !== "number" || amount <= 0) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: "Amount must be a positive number" });
    }

    const MAX_TRANSACTION = 1000000;
    if (amount > MAX_TRANSACTION) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: `Maximum transaction amount is ${MAX_TRANSACTION}` });
    }

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { 
                $inc: { walletBalance: amount },
                $push: {
                    notifications: {
                        _id: new mongoose.Types.ObjectId().toString(),
                        message: `Added ${amount} to wallet`,
                        type: 'walletUpdated',
                        timestamp: new Date()
                    }
                }
            },
            { 
                new: true,
                runValidators: true,
                session 
            }
        );

    if (!updatedUser) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User not found" });
    }

    await session.commitTransaction();
    res.status(200).json({
      walletBalance: updatedUser.walletBalance,
      transactionId: new mongoose.Types.ObjectId(),
    });
  } catch (error) {
    await session.abortTransaction();
    res
      .status(500)
      .json({ message: "Error adding funds to wallet", error: error.message });
  } finally {
    session.endSession();
  }
};

// Clear notifications
export const clearNotifications = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId } = req.body;

    const result = await User.updateOne(
      { _id: userId },
      { $set: { notifications: [] } },
      { session }
    );

    if (result.matchedCount === 0) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User not found" });
    }

    await session.commitTransaction();
    res.status(200).json({ message: "Notifications cleared" });
  } catch (error) {
    await session.abortTransaction();
    res
      .status(500)
      .json({ message: "Error clearing notifications", error: error.message });
  } finally {
    session.endSession();
  }
};

// Mark notifications as read
export const markNotificationsAsRead = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, notificationIds } = req.body;

    const updateQuery =
      notificationIds && Array.isArray(notificationIds)
        ? {
            $set: { "notifications.$[elem].isRead": true },
          }
        : {
            $set: { "notifications.$[].isRead": true },
          };

    const options =
      notificationIds && Array.isArray(notificationIds)
        ? {
            arrayFilters: [{ "elem._id": { $in: notificationIds } }],
            session,
          }
        : { session };

    const result = await User.updateOne({ _id: userId }, updateQuery, options);

    if (result.matchedCount === 0) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User not found" });
    }

    await session.commitTransaction();
    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error) {
    await session.abortTransaction();
    res
      .status(500)
      .json({
        message: "Error marking notifications as read",
        error: error.message,
      });
  } finally {
    session.endSession();
  }
};

// Mark single notification as read
export const markNotificationAsRead = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, notificationId } = req.body;

    if (!userId || !notificationId) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: "User ID and Notification ID are required" });
    }

    const result = await User.updateOne(
      {
        _id: userId,
        "notifications._id": notificationId,
      },
      {
        $set: { "notifications.$.isRead": true },
      },
      { session }
    );

    if (result.matchedCount === 0) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ message: "User or notification not found" });
    }

    await session.commitTransaction();
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    await session.abortTransaction();
    res
      .status(500)
      .json({
        message: "Error marking notification as read",
        error: error.message,
      });
  } finally {
    session.endSession();
  }
};

export default {
  getUserById,
  getOwnProfile,
  addFundsToWallet,
  clearNotifications,
  markNotificationsAsRead,
  markNotificationAsRead,
};

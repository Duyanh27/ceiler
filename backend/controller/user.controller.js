import User from "../models/user.model.js";
import mongoose from "mongoose";

// Get user by ID (for public profile viewing)
export const getUserById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const user = await User.findById(req.params.id)
            .select("username email imageUrl activeBids wonAuctions")  // Added imageUrl
            .populate('activeBids', 'amount status')
            .populate('wonAuctions', 'title status');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
};

// Add funds to wallet
export const addFundsToWallet = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, userId } = req.body; // Get userId from body for testing

        // Validate amount
        if (!amount || typeof amount !== 'number' || amount <= 0) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Amount must be a positive number" });
        }

        const MAX_TRANSACTION = 1000000;
        if (amount > MAX_TRANSACTION) {
            await session.abortTransaction();
            return res.status(400).json({ message: `Maximum transaction amount is ${MAX_TRANSACTION}` });
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
            transactionId: new mongoose.Types.ObjectId()
        });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Error adding funds to wallet", error: error.message });
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
        res.status(500).json({ message: "Error clearing notifications", error: error.message });
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

        const updateQuery = notificationIds && Array.isArray(notificationIds)
            ? {
                $set: { "notifications.$[elem].isRead": true }
            }
            : {
                $set: { "notifications.$[].isRead": true }
            };

        const options = notificationIds && Array.isArray(notificationIds)
            ? {
                arrayFilters: [{ "elem._id": { $in: notificationIds } }],
                session
            }
            : { session };

        const result = await User.updateOne(
            { _id: userId },
            updateQuery,
            options
        );

        if (result.matchedCount === 0) {
            await session.abortTransaction();
            return res.status(404).json({ message: "User not found" });
        }

        await session.commitTransaction();
        res.status(200).json({ message: "Notifications marked as read" });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Error marking notifications as read", error: error.message });
    } finally {
        session.endSession();
    }
};

export default {
    getUserById,
    addFundsToWallet,
    clearNotifications,
    markNotificationsAsRead
};
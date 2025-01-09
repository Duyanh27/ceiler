import User from "../models/user.model.js";
import mongoose from "mongoose";

/**
 * User Controller Security and Race Condition Notes:
 * 
 * 1. Wallet Operations:
 *    - All wallet modifications must use transactions
 *    - Use $inc for atomic updates when possible
 *    - Always validate amounts before processing
 * 
 * 2. Notification Handling:
 *    - Use bulk operations for efficiency
 *    - Maintain order of notifications
 *    - Prevent notification spam
 */

// Get all users with pagination and basic filtering
export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const query = {};

        // Add search filter if provided
        if (search) {
            query.$or = [
                { username: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') }
            ];
        }

        const users = await User.find(query)
            .select("-password -notifications") // Exclude sensitive data
            .sort("username")
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await User.countDocuments(query);

        res.status(200).json({
            users,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

// Get user by ID with proper validation
export const getUserById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const user = await User.findById(req.params.id)
            .select("-password")
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

// Update user profile with proper validation
export const updateUserProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const userId = req.auth.userId;

        // Validate input
        if (username && (username.length < 3 || username.length > 50)) {
            return res.status(400).json({ 
                message: "Username must be between 3 and 50 characters" 
            });
        }

        if (email && !email.match(/^\S+@\S+\.\S+$/)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Check for existing email
        if (email) {
            const existingUser = await User.findOne({ 
                email, 
                _id: { $ne: userId } 
            });
            if (existingUser) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update only provided fields
        if (username) user.username = username;
        if (email) user.email = email;

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error updating user profile", error: error.message });
    }
};

/**
 * Add funds to user wallet with race condition prevention
 * Uses transaction to ensure wallet balance consistency
 */
export const addFundsToWallet = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount } = req.body;
        const userId = req.auth.userId;

        // Validate amount
        if (!amount || typeof amount !== 'number' || amount <= 0) {
            await session.abortTransaction();
            return res.status(400).json({ 
                message: "Amount must be a positive number" 
            });
        }

        // Set maximum allowed transaction amount
        const MAX_TRANSACTION = 1000000;
        if (amount > MAX_TRANSACTION) {
            await session.abortTransaction();
            return res.status(400).json({ 
                message: `Maximum transaction amount is ${MAX_TRANSACTION}` 
            });
        }

        // Use atomic update with transaction
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

// Notification Management
export const clearNotifications = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.auth.userId;

        const user = await User.findById(userId).session(session);
        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({ message: "User not found" });
        }

        // Clear notifications atomically
        await User.updateOne(
            { _id: userId },
            { $set: { notifications: [] } },
            { session }
        );

        await session.commitTransaction();
        res.status(200).json({ message: "Notifications cleared" });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Error clearing notifications", error: error.message });
    } finally {
        session.endSession();
    }
};

// Mark notifications as read with batch processing
export const markNotificationsAsRead = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.auth.userId;
        const { notificationIds } = req.body; // Optional: specific notifications to mark

        const user = await User.findById(userId).session(session);
        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({ message: "User not found" });
        }

        if (notificationIds && Array.isArray(notificationIds)) {
            // Mark specific notifications as read
            await User.updateOne(
                { _id: userId },
                { 
                    $set: {
                        "notifications.$[elem].isRead": true 
                    }
                },
                { 
                    arrayFilters: [{ "elem._id": { $in: notificationIds } }],
                    session 
                }
            );
        } else {
            // Mark all notifications as read
            await User.updateOne(
                { _id: userId },
                { 
                    $set: { 
                        "notifications.$[].isRead": true 
                    }
                },
                { session }
            );
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
import Bid from "../models/bid.model.js";
import Item from "../models/item.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const createBid = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { itemId, amount } = req.body;
        const userId = req.auth.userId;

        // Check user wallet balance (Fix Race Conditions)
        const user = await User.findOne({ clerkId: userId }).session(session);
        if (!user || user.walletBalance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient wallet balance" });
        }

        const item = await Item.findById(itemId).session(session);
        if (!item) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Item not found" });
        }

        if (item.status !== 'active') {
            await session.abortTransaction();
            return res.status(400).json({ message: "Item is not active" });
        }

        if (item.endTime < new Date()) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Auction has ended" });
        }

        const currentHighest = item.highestBid?.amount || item.startingPrice;
        if (amount <= currentHighest) {
            await session.abortTransaction();
            return res.status(400).json({ 
                message: `Bid must be higher than ${currentHighest}` 
            });
        }

        // Create new bid (Fix Race Conditions)
        const newBid = await Bid.create([{
            _id: new mongoose.Types.ObjectId().toString(),
            itemId,
            userId: user._id,
            amount,
            status: 'active'
        }], { session });

        // Update previous highest bid and notify user (Enhance Notifications)
        if (item.highestBid?.bidId) {
            const outbidUser = await User.findById(item.highestBid.userId).session(session);
            if (outbidUser) {
                // Update previous bid status (Fix Race Conditions)
                await Bid.findByIdAndUpdate(
                    item.highestBid.bidId,
                    { status: 'outbid' },
                    { session }
                );

                // Add outbid notification (Enhance Notifications)
                outbidUser.notifications.push({
                    _id: new mongoose.Types.ObjectId().toString(),
                    message: `You've been outbid on ${item.title}`,
                    type: 'bidOutbid',
                    relatedItemId: itemId,
                    relatedBidId: item.highestBid.bidId
                });
                await outbidUser.save({ session });
            }
        }

        // Update item (Fix Race Conditions)
        item.highestBid = {
            bidId: newBid[0]._id,
            amount: amount,
            userId: user._id,
            timestamp: new Date()
        };
        item.totalBids += 1;
        await item.save({ session });

        // Update user's active bids (Fix Race Conditions)
        user.activeBids.push(newBid[0]._id);
        // Reserve the bid amount from wallet
        user.walletBalance -= amount;
        await user.save({ session });

        await session.commitTransaction();
        res.status(201).json(newBid[0]);
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Error creating bid", error: error.message });
    } finally {
        session.endSession();
    }
};

export const getBidHistory = async (req, res) => {
    try {
        const { itemId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const bids = await Bid.find({ itemId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('userId', 'username');

        const total = await Bid.countDocuments({ itemId });

        res.status(200).json({
            bids,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching bid history", error: error.message });
    }
};

export const getUserBids = async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.auth.userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const bids = await Bid.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate({
                path: 'itemId',
                select: 'title imageUrl endTime status'
            });

        const total = await Bid.countDocuments({ userId: user._id });

        res.status(200).json({
            bids,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user bids", error: error.message });
    }
};

// Utility function for handling auction end
export const handleAuctionEnd = async (itemId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const item = await Item.findById(itemId).session(session);
        if (!item || item.status !== 'active') return;

        // Set winner (Include Missing Logic)
        if (item.highestBid?.userId) {
            item.status = 'completed';
            item.winner = item.highestBid.userId;

            // Update winner's profile (Enhance Notifications)
            const winner = await User.findById(item.highestBid.userId).session(session);
            if (winner) {
                winner.wonAuctions.push(itemId);
                winner.notifications.push({
                    _id: new mongoose.Types.ObjectId().toString(),
                    message: `You won the auction for ${item.title}!`,
                    type: 'bidWon',
                    relatedItemId: itemId
                });
                await winner.save({ session });

                // Return bid amounts for all losing bids (Include Missing Logic)
                const losingBids = await Bid.find({
                    itemId,
                    userId: { $ne: winner._id },
                    status: { $in: ['active', 'outbid'] }
                }).session(session);

                for (const bid of losingBids) {
                    const bidder = await User.findById(bid.userId).session(session);
                    if (bidder) {
                        bidder.walletBalance += bid.amount;
                        await bidder.save({ session });
                    }
                }
            }
        } else {
            item.status = 'completed';
        }

        await item.save({ session });
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        console.error('Error handling auction end:', error);
    } finally {
        session.endSession();
    }
};

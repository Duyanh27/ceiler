import Item from "../models/item.model.js";
import Category from "../models/category.model.js";
import Bid from "../models/bid.model.js";
import mongoose from "mongoose";

export const getAllItems = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            categoryId, 
            status,
            search,
            minPrice,
            maxPrice,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const filters = {};

        if (categoryId) {
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                return res.status(400).json({ message: "Invalid category ID" });
            }
            filters.category = categoryId;
        }

        if (status) {
            filters.status = status;
        }

        if (search) {
            filters.$or = [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') }
            ];
        }

        if (minPrice !== undefined) {
            filters.startingPrice = { $gte: parseFloat(minPrice) };
        }

        if (maxPrice !== undefined) {
            filters.startingPrice = { 
                ...filters.startingPrice,
                $lte: parseFloat(maxPrice) 
            };
        }

        // Validate sort parameters
        const validSortFields = ['createdAt', 'startingPrice', 'endTime', 'totalBids'];
        const actualSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
        const actualSortOrder = sortOrder === 'asc' ? 1 : -1;

        const items = await Item.find(filters)
            .sort({ [actualSortBy]: actualSortOrder })
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .populate('category', 'name path')
            .select('-__v');

        const total = await Item.countDocuments(filters);

        res.status(200).json({
            items,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                total,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching items", error: error.message });
    }
};

export const getItemById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid item ID format" });
        }

        const item = await Item.findById(req.params.id)
            .populate('category', 'name path')
            .populate('createdBy', 'username');

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: "Error fetching item", error: error.message });
    }
};

export const createItem = async (req, res) => {
    try {
        const { title, description, startingPrice, category, endTime, imageUrl } = req.body;
        const userId = req.auth.userId;

        // Input validation
        if (!title || title.trim().length < 3 || title.trim().length > 100) {
            return res.status(400).json({ 
                message: "Title must be between 3 and 100 characters" 
            });
        }

        if (description && description.trim().length > 1000) {
            return res.status(400).json({ 
                message: "Description cannot exceed 1000 characters" 
            });
        }

        if (!startingPrice || startingPrice <= 0) {
            return res.status(400).json({ 
                message: "Starting price must be greater than 0" 
            });
        }

        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ message: "Invalid category ID" });
        }

        // Validate endTime
        const minEndTime = new Date(Date.now() + 60 * 60 * 1000); // Minimum 1 hour
        const maxEndTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Maximum 30 days
        const parsedEndTime = new Date(endTime);

        if (parsedEndTime < minEndTime) {
            return res.status(400).json({ 
                message: "End time must be at least 1 hour in the future" 
            });
        }

        if (parsedEndTime > maxEndTime) {
            return res.status(400).json({ 
                message: "End time cannot be more than 30 days in the future" 
            });
        }

        // Validate category existence
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ message: "Category not found" });
        }

        // Create new item
        const newItem = await Item.create({
            _id: new mongoose.Types.ObjectId().toString(),
            title: title.trim(),
            description: description ? description.trim() : '',
            startingPrice,
            category,
            endTime: parsedEndTime,
            imageUrl,
            createdBy: userId,
            status: 'active',
            totalBids: 0
        });

        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: "Error creating item", error: error.message });
    }
};

export const updateItem = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { title, description, category, imageUrl } = req.body;
        const itemId = req.params.id;
        const userId = req.auth.userId;

        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ message: "Invalid item ID format" });
        }

        const item = await Item.findById(itemId).session(session);
        if (!item) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Item not found" });
        }

        // Verify ownership
        if (item.createdBy.toString() !== userId) {
            await session.abortTransaction();
            return res.status(403).json({ message: "Not authorized to update this item" });
        }

        // Prevent updates to completed or cancelled items
        if (item.status !== 'active') {
            await session.abortTransaction();
            return res.status(400).json({ 
                message: "Cannot update completed or cancelled items" 
            });
        }

        // Validate inputs if provided
        if (title) {
            if (title.trim().length < 3 || title.trim().length > 100) {
                await session.abortTransaction();
                return res.status(400).json({ 
                    message: "Title must be between 3 and 100 characters" 
                });
            }
            item.title = title.trim();
        }

        if (description !== undefined) {
            if (description.trim().length > 1000) {
                await session.abortTransaction();
                return res.status(400).json({ 
                    message: "Description cannot exceed 1000 characters" 
                });
            }
            item.description = description.trim();
        }

        if (category) {
            if (!mongoose.Types.ObjectId.isValid(category)) {
                await session.abortTransaction();
                return res.status(400).json({ message: "Invalid category ID" });
            }

            const categoryExists = await Category.findById(category).session(session);
            if (!categoryExists) {
                await session.abortTransaction();
                return res.status(400).json({ message: "Category not found" });
            }
            item.category = category;
        }

        if (imageUrl !== undefined) {
            item.imageUrl = imageUrl;
        }

        await item.save({ session });
        await session.commitTransaction();

        res.status(200).json(item);
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Error updating item", error: error.message });
    } finally {
        session.endSession();
    }
};

export const deleteItem = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const itemId = req.params.id;
        const userId = req.auth.userId;

        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ message: "Invalid item ID format" });
        }

        const item = await Item.findById(itemId).session(session);
        if (!item) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Item not found" });
        }

        // Verify ownership
        if (item.createdBy.toString() !== userId) {
            await session.abortTransaction();
            return res.status(403).json({ message: "Not authorized to delete this item" });
        }

        // Prevent deletion of items with active bids
        if (item.totalBids > 0) {
            await session.abortTransaction();
            return res.status(400).json({ 
                message: "Cannot delete item with active bids" 
            });
        }

        await Item.deleteOne({ _id: itemId }).session(session);
        await session.commitTransaction();

        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Error deleting item", error: error.message });
    } finally {
        session.endSession();
    }
};

export const markItemAsCompleted = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const itemId = req.params.id;
        const userId = req.auth.userId;

        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ message: "Invalid item ID format" });
        }

        const item = await Item.findById(itemId).session(session);
        if (!item) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Item not found" });
        }

        // Verify ownership
        if (item.createdBy.toString() !== userId) {
            await session.abortTransaction();
            return res.status(403).json({ 
                message: "Not authorized to complete this item" 
            });
        }

        if (item.status !== "active") {
            await session.abortTransaction();
            return res.status(400).json({ message: "Item is not active" });
        }

        item.status = "completed";
        await item.save({ session });

        // Handle auction completion logic
        await handleAuctionEnd(itemId);

        await session.commitTransaction();
        res.status(200).json(item);
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ 
            message: "Error marking item as completed", 
            error: error.message 
        });
    } finally {
        session.endSession();
    }
};
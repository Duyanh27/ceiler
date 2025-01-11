import e from "express";
import mongoose from "mongoose";
import Item from "../models/item.model.js";
import Bid from "../models/bid.model.js";
import Category from "../models/category.model.js";

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
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filters = {};

    // Filter by category (including parent-child hierarchy)
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const childCategories = await Category.find({
        parentCategory: categoryId,
      });
      const categoryIds = [
        categoryId,
        ...childCategories.map((cat) => cat._id),
      ];
      filters.categories = { $in: categoryIds };
    }

    // Filter by status
    if (status) {
      filters.status = status;
    }

    // Search by title or description
    if (search) {
      filters.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
    }

    // Filter by price range (highestBid.amount or startingPrice)
    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);

      filters.$or = [
        { "highestBid.amount": priceFilter },
        { startingPrice: priceFilter },
      ];
    }

    // Validate and sanitize sort parameters
    const validSortFields = [
      "createdAt",
      "startingPrice",
      "endTime",
      "totalBids",
    ];
    const actualSortBy = validSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";
    const actualSortOrder = sortOrder === "asc" ? 1 : -1;

    // Fetch filtered and paginated items
    const items = await Item.find(filters)
      .sort({ [actualSortBy]: actualSortOrder })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .populate("categories", "name")
      .select("-__v");

    // Count total items matching the filters
    const total = await Item.countDocuments(filters);

    // Return items with pagination info
    res.status(200).json({
      items,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
      },
    });
  } catch (error) {
    console.error("Error in getAllItems:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching items", error: error.message });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("category", "name")
      .populate("createdBy", "name email");
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching item", error });
  }
};

export const createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      startingPrice,
      categories,
      endTime,
      imageUrl,
      userId, // Include userId in the body
    } = req.body;

    // Input validation
    if (!title || title.trim().length < 3 || title.trim().length > 100) {
      return res.status(400).json({
        message: "Title must be between 3 and 100 characters",
      });
    }

    if (description && description.trim().length > 1000) {
      return res.status(400).json({
        message: "Description cannot exceed 1000 characters",
      });
    }

    if (!startingPrice || startingPrice <= 0) {
      return res.status(400).json({
        message: "Starting price must be greater than 0",
      });
    }

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({
        message: "Categories must be a non-empty array of valid category IDs",
      });
    }

    const existingCategories = await Category.find({
      _id: { $in: categories },
    });
    if (existingCategories.length !== categories.length) {
      const invalidCategories = categories.filter(
        (category) => !existingCategories.some((cat) => cat._id === category)
      );

      return res.status(400).json({
        message: `Invalid category IDs: ${invalidCategories.join(", ")}`,
      });
    }

    // Validate endTime
    const minEndTime = new Date(Date.now() + 60 * 60 * 1000); // Minimum 1 hour
    const maxEndTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Maximum 30 days
    const parsedEndTime = new Date(endTime);

    if (parsedEndTime < minEndTime) {
      return res.status(400).json({
        message: "End time must be at least 1 hour in the future",
      });
    }

    if (parsedEndTime > maxEndTime) {
      return res.status(400).json({
        message: "End time cannot be more than 30 days in the future",
      });
    }

    // Create new item
    const newItem = await Item.create({
      _id: new mongoose.Types.ObjectId().toString(),
      title: title.trim(),
      description: description ? description.trim() : "",
      startingPrice,
      categories,
      endTime: parsedEndTime,
      imageUrl,
      createdBy: userId, // Set createdBy from the request body
      status: "active",
      highestBid: null,
      totalBids: 0,
      winner: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({
      message: "Item created successfully",
      item: newItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating item",
      error: error.message,
    });
  }
};

export const updateItem = async (req, res) => {
  try {
    const {
      title,
      description,
      startingPrice,
      currentPrice,
      imageUrl,
      category,
      endTime,
      status,
    } = req.body;

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        startingPrice,
        currentPrice,
        imageUrl,
        category,
        endTime,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res
      .status(200)
      .json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    res.status(500).json({ message: "Error updating item", error });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error });
  }
};

export const bidItem = (io) => async (req, res) => {
  try {
    const { newBid, userId } = req.body; // Extract the new bid and user ID from the request body
    const itemId = req.params.id; // Extract the item ID from the route parameter

    // Validate input
    if (!newBid || !userId || !itemId) {
      return res
        .status(400)
        .json({ message: "Invalid input. Ensure all fields are provided." });
    }

    // Check if the item exists in the Item collection
    const item = await Item.findById(itemId)
      .populate("highestBid.bidId")
      .exec();
    if (!item) {
      return res
        .status(404)
        .json({ message: "Item not available for bidding." });
    }

    // Check if the auction is still active
    if (item.status !== "active") {
      return res
        .status(400)
        .json({ message: "Bidding is closed for this item." });
    }

    // Check if the auction has expired
    if (item.endTime < new Date()) {
      // Mark the item as completed
      item.status = "completed";
      await item.save();
      return res.status(400).json({ message: "The auction has ended." });
    }

    // Fetch the current highest bid for the item
    const highestBid = item.highestBid?.amount || item.startingPrice;

    // Ensure the new bid is higher than the current highest bid
    if (newBid <= highestBid) {
      return res.status(400).json({
        message: `Bid must be higher than the current highest bid of ${highestBid}.`,
      });
    }

    // Mark the previous highest bid as "outbid"
    if (item.highestBid?.bidId) {
      await Bid.findByIdAndUpdate(item.highestBid.bidId, { status: "outbid" });
    }

    // Create a new bid
    const newBidEntry = new Bid({
      _id: new mongoose.Types.ObjectId().toString(),
      userId,
      itemId,
      amount: newBid,
      status: "active",
      createdAt: new Date(),
    });
    await newBidEntry.save();

    // Update the item's highest bid and total bids
    item.highestBid = {
      bidId: newBidEntry._id,
      amount: newBid,
      userId,
      createdAt: new Date(),
    };
    item.totalBids += 1;
    await item.save();

    // Emit a Socket.IO event to notify all clients about the new bid
    io.emit("newBid", {
      itemId,
      userId,
      amount: newBid,
      message: "A new bid has been placed!",
    });

    // Return success response
    return res.status(200).json({
      message: "Bid placed successfully",
      bid: newBidEntry,
      highestBid: item.highestBid,
    });
  } catch (error) {
    console.error("Error in bidItem:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

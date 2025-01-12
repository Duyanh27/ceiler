import e from "express";
import mongoose from "mongoose";
import Item from "../models/item.model.js";
import Bid from "../models/bid.model.js";
import Category from "../models/category.model.js";
import User from "../models/user.model.js"; // Import your user model

const validateBase64Image = (base64String) => {
  if (!base64String) {
    throw new Error("Image is required");
  }

  // Clean the base64 string by removing whitespace and line breaks
  const cleanBase64 = base64String.replace(/[\r\n\s]/g, "");

  // Check if it's a valid base64 image
  if (!cleanBase64.match(/^data:image\/(jpeg|jpg|png|gif);base64,/)) {
    throw new Error(
      "Invalid image format. Must be a valid image (JPEG, PNG, or GIF)"
    );
  }

  // Get the base64 data part
  const base64Data = cleanBase64.split(",")[1];

  // Check file size (base64 length * 0.75 gives approximate size in bytes)
  const approximateSize = Math.ceil((base64Data.length * 3) / 4);
  const maxSize = 5 * 1024 * 1024; // 5MB limit

  if (approximateSize > maxSize) {
    throw new Error("Image size must be less than 5MB");
  }

  return cleanBase64;
};

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
      console.log("Filtering by categoryId:", categoryId);
      const category = await Category.findById(categoryId);
      if (!category) {
        console.log("Invalid category ID:", categoryId);
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

    // Filter by price range
    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);

      filters.$or = [
        { "highestBid.amount": priceFilter },
        { startingPrice: priceFilter },
      ];
    }

    // Validate sort parameters
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

    // Fetch items with populated categories
    const items = await Item.find(filters)
      .sort({ [actualSortBy]: actualSortOrder })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .select("-__v")
      .lean(); // Using lean() for better performance

    // Count total items
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
    res.status(500).json({
      message: "Error fetching items",
      error: error.message,
    });
  }
};

export const getItemById = async (req, res) => {
  try {
    console.log("Fetching item with ID:", req.params.id);

    const item = await Item.findById(req.params.id);

    if (!item) {
      console.log("Item not found for ID:", req.params.id);
      return res.status(404).json({ message: "Item not found" });
    }

    console.log("Item found:", item._id);
    res.status(200).json(item);
  } catch (error) {
    console.error("Error in getItemById:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      message: "Error fetching item",
      error: error.message,
      stack: error.stack,
    });
  }
};

export const createItem = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const { title, description, startingPrice, image, categories, endTime } =
      req.body;

    const userId = req.auth.userId; // Extract authenticated user ID

    // Check if the user exists in the database
    const userExists = await User.findOne({ clerkId: userId });
    if (!userExists) {
      return res.status(404).json({
        message: "User not found in the database. Please register first.",
      });
    }

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

    // Validate and process image
    try {
      validateBase64Image(image);
    } catch (imageError) {
      return res.status(400).json({
        message: "Image validation failed",
        error: imageError.message,
      });
    }

    // Validate categories
    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({
        message: "At least one category must be selected",
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
    const parsedEndTime = new Date(endTime);
    const minEndTime = new Date(Date.now() + 60 * 60 * 1000); // Minimum 1 hour
    const maxEndTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Maximum 30 days

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
      image, // Store the validated base64 image
      categories,
      endTime: parsedEndTime,
      createdBy: userId, // Assign authenticated user's ID
      status: "active",
      highestBid: null,
      totalBids: 0,
      winner: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      message: "Item created successfully",
      item: newItem,
    });
  } catch (error) {
    console.error("Error in createItem:", error);
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
      image,
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
        image,
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
    console.log("🔧 Starting bidItem function...");
    
    const { newBid } = req.body; // Extract `newBid` from request body
    const userId = req.auth?.userId; // Extract user ID from `req.auth` set by the middleware
    const itemId = req.params.id; // Extract item ID from route parameters

    // Validate input
    if (!newBid || !userId || !itemId) {
      console.error("❌ Missing required fields:", { newBid, userId, itemId });
      return res
        .status(400)
        .json({ message: "Invalid input. Ensure all fields are provided." });
    }

    // Check if the item exists
    const item = await Item.findById(itemId)
      .populate("highestBid.bidId")
      .exec();

    if (!item) {
      console.error("❌ Item not found for ID:", itemId);
      return res
        .status(404)
        .json({ message: "Item not available for bidding." });
    }

    // Check if the auction is still active
    if (item.status !== "active") {
      console.error("❌ Auction closed for item:", itemId);
      return res
        .status(400)
        .json({ message: "Bidding is closed for this item." });
    }

    // Check if the auction has expired
    if (item.endTime < new Date()) {
      item.status = "completed";
      await item.save();
      console.error("❌ Auction ended for item:", itemId);
      return res.status(400).json({ message: "The auction has ended." });
    }

    // Validate new bid
    const highestBid = item.highestBid?.amount || item.startingPrice;
    if (newBid <= highestBid) {
      console.error(
        `❌ New bid ${newBid} is not higher than current highest bid ${highestBid}`
      );
      return res.status(400).json({
        message: `Bid must be higher than the current highest bid of ${highestBid}.`,
      });
    }

    // Mark the previous highest bid as "outbid"
    if (item.highestBid?.bidId) {
      console.log("ℹ️ Marking previous highest bid as 'outbid':", item.highestBid.bidId);
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

    // Update item's highest bid and total bids
    item.highestBid = {
      bidId: newBidEntry._id,
      amount: newBid,
      userId,
      createdAt: new Date(),
    };
    item.totalBids += 1;
    await item.save();

    console.log("✅ New bid placed successfully:", newBidEntry);

    // Emit Socket.IO event to notify clients
    io.emit("newBid", {
      itemId,
      userId,
      amount: newBid,
      message: "A new bid has been placed!",
    });

    io.emit("priceUpdate", {
      itemId,
      newPrice: newBid,
      message: "A new bid has been placed!",
    });

    // Return success response
    return res.status(200).json({
      message: "Bid placed successfully",
      bid: newBidEntry,
      highestBid: item.highestBid,
    });
  } catch (error) {
    console.error("❌ Error in bidItem:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

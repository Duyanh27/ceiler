import e from "express";
import Item from "../models/item.model.js";
import Bid from "../models/bid.model.js";


export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("category", "name")
      .populate("createdBy", "name email");
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error });
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
      _id,
      title,
      description,
      startingPrice,
      currentPrice,
      imageUrl,
      category,
      createdBy,
      endTime,
    } = req.body;

    const newItem = new Item({
      _id,
      title,
      description,
      startingPrice,
      currentPrice,
      imageUrl,
      category,
      createdBy,
      endTime,
    });

    await newItem.save();
    res
      .status(201)
      .json({ message: "Item created successfully", item: newItem });
  } catch (error) {
    res.status(500).json({ message: "Error creating item", error });
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

    if (!newBid || !userId || !itemId) {
      return res.status(400).json({ message: "Invalid input. Ensure all fields are provided." });
    }

    // Check if the item exists in the Item collection
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not available for bidding." });
    }

    // Fetch the highest bid for the given item
    const highestBid = await Bid.findOne({ itemId }).sort({ amount: -1 });

    if (!highestBid) {
      // No previous bids, so save the new bid and update the item's current price
      const newBidEntry = new Bid({ userId, itemId, amount: newBid });
      await newBidEntry.save();

      // Update the current price in the Item schema
      item.currentPrice = newBid;
      await item.save();

      // Emit a Socket.IO event to notify clients
      io.emit('newBid', {
        itemId,
        userId,
        amount: newBid,
        message: "A new bid has been placed!",
      });

      return res.status(200).json({ message: "Bid placed successfully", bid: newBidEntry });
    }

    // Compare the new bid with the highest bid
    if (newBid > highestBid.amount) {
      // New bid is higher, save it and update the item's current price
      const newBidEntry = new Bid({ userId, itemId, amount: newBid });
      await newBidEntry.save();

      // Update the current price in the Item schema
      item.currentPrice = newBid;
      await item.save();

      // Emit a Socket.IO event to notify clients
      io.emit('newBid', {
        itemId,
        userId,
        amount: newBid,
        message: "A new bid has been placed!",
      });

      return res.status(200).json({ message: "Bid placed successfully", bid: newBidEntry });
    } else {
      // New bid is not higher
      return res.status(400).json({
        message: "Bid must be higher than the current highest bid",
        highestBid: highestBid.amount,
      });
    }
  } catch (error) {
    console.error("Error in bidItem:", error.message);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};




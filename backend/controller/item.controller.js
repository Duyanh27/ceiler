import Item from "../models/item.model";

export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate("category", "name").populate("createdBy", "name email");
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("category", "name").populate("createdBy", "name email");
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
    const { _id, title, description, startingPrice, currentPrice, imageUrl, category, createdBy, endTime } = req.body;

    const newItem = new Item({ _id, title, description, startingPrice, currentPrice, imageUrl, category, createdBy, endTime });

    await newItem.save();
    res.status(201).json({ message: "Item created successfully", item: newItem });
  } catch (error) {
    res.status(500).json({ message: "Error creating item", error });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { title, description, startingPrice, currentPrice, imageUrl, category, endTime, status } = req.body;

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { title, description, startingPrice, currentPrice, imageUrl, category, endTime, status },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item updated successfully", item: updatedItem });
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


// Export all the controller functions
module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};

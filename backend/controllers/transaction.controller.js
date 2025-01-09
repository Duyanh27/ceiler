import Transaction from "../models/transaction.model";

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("userId", "name email"); // Populate user details
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate("userId", "name email");
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transaction", error });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { _id, userId, type, amount, description } = req.body;

    const newTransaction = new Transaction({ _id, userId, type, amount, description });

    await newTransaction.save(); // Save transaction to the database
    res.status(201).json({ message: "Transaction created successfully", transaction: newTransaction });
  } catch (error) {
    res.status(500).json({ message: "Error creating transaction", error });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { type, amount, description } = req.body;

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { type, amount, description },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction updated successfully", transaction: updatedTransaction });
  } catch (error) {
    res.status(500).json({ message: "Error updating transaction", error });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting transaction", error });
  }
};

// Export all the controller functions
module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};

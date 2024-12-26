import express from "express";
import {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

// Define routes
router.get("/", getAllTransactions); // Get all transactions
router.get("/:id", getTransactionById); // Get a transaction by ID
router.post("/", createTransaction); // Create a new transaction
router.put("/:id", updateTransaction); // Update a transaction by ID
router.delete("/:id", deleteTransaction); // Delete a transaction by ID

export default router;
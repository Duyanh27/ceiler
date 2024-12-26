import User from "../models/user.model.js";
import { clerkClient, getAuth } from "@clerk/express";

// Retrieve all users (mod-only)
export const getAllUsers = async (req, res) => {
  try {
    const { userId: clerkId } = getAuth(req);

    // Check if the requester is a mod
    const requestingUser = await User.findOne({ clerkId });
    if (requestingUser.role !== "mod") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Retrieve a user by Clerk ID (current user)
export const getUserByClerkId = async (req, res) => {
  try {
    const { userId: clerkId } = getAuth(req);

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// Sync user from Clerk (create or update)
export const syncUser = async (req, res) => {
  try {
    const { userId: clerkId } = getAuth(req);

    const clerkUser = await clerkClient.users.getUser(clerkId);

    const user = await User.findOneAndUpdate(
      { clerkId },
      {
        clerkId,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: `${clerkUser.firstName} ${clerkUser.lastName}`,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "User synced successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error syncing user", error });
  }
};

// Update wallet balance
export const updateWalletBalance = async (req, res) => {
  try {
    const { userId: clerkId } = getAuth(req);
    const { walletBalance } = req.body;

    const user = await User.findOneAndUpdate(
      { clerkId },
      { walletBalance },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Wallet balance updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating wallet balance", error });
  }
};

// Delete a user (mod-only)
export const deleteUser = async (req, res) => {
  try {
    const { userId: clerkId } = getAuth(req);
    const { id } = req.params;

    // Check if the requester is a mod
    const requestingUser = await User.findOne({ clerkId });
    if (requestingUser.role !== "mod") {
      return res.status(403).json({ message: "Access denied" });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

export default {
  getAllUsers,
  getUserByClerkId,
  syncUser,
  updateWalletBalance,
  deleteUser,
};

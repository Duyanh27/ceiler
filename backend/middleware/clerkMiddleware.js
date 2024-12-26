import { getAuth } from "@clerk/express";
import clerkClient from "../config/clerk.js";
import User from "../models/user.model.js";

export const syncUserMiddleware = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const clerkUser = await clerkClient.users.getUser(userId);

    await User.findOneAndUpdate(
      { clerkId: userId },
      {
        clerkId: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: `${clerkUser.firstName} ${clerkUser.lastName}`,
      },
      { upsert: true } // Create or update the user
    );

    next();
  } catch (error) {
    res.status(500).json({ message: "Error syncing user", error });
  }
};

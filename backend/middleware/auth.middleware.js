// /backend/middleware/auth.middleware.js
import { clerkMiddleware, requireAuth } from '@clerk/express';

// Basic authentication check
export const authMiddleware = clerkMiddleware();

// Strict authentication for protected routes
export const requireAuthentication = requireAuth();

// Role-based authentication for moderators
export const requireModerator = async (req, res, next) => {
  try {
    const { userId } = req.auth;
    const user = await User.findOne({ clerkId: userId });
    if (user.role !== 'buyer') {
      return res.status(401).json({ error: 'Buyer access required' });
    }

    if (user.role !== 'seller') {
      return res.status(403).json({ error: 'Seller access required' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Authorization check failed' });
  }
};

// Error handling middleware
export const handleAuthError = (err, req, res, next) => {
  if (err.statusCode === 401) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Please sign in to continue'
    });
  }
  next(err);
};
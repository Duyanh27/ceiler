import jwt from 'jsonwebtoken';


export const verifyClerkJWT = async (req, res, next) => {
    try {
      console.log("🔐 Verifying JWT...");
      
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("❌ No Bearer token found");
        return res.status(401).json({ message: "No token provided" });
      }
      
      const token = authHeader.split(" ")[1];
      console.log("🎟️ Token received:", token);
      
      const publicKey = process.env.CLERK_PEM_PUBLIC_KEY;
      if (!publicKey) {
        console.error("❌ No public key found");
        return res.status(500).json({ message: "Server configuration error" });
      }
      
      try {
        const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
        console.log("✅ Token decoded:", decoded);
        
        const userId = decoded.sub;
        const isValidUserId = /^user_[a-zA-Z0-9]+$/.test(userId);
        if (!isValidUserId) {
          console.error("❌ Invalid user ID format:", userId);
          return res.status(400).json({ message: "Invalid user ID format" });
        }
        
        req.auth = { userId };
        console.log("🔑 Authenticated user ID:", req.auth.userId);
        next();
      } catch (error) {
        console.error("❌ JWT verification failed:", error.message);
        return res.status(401).json({ message: "Invalid token", error: error.message });
      }
    } catch (error) {
      console.error("❌ Middleware error:", error.message);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
  
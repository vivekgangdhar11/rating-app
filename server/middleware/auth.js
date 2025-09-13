const { verifyToken } = require("../utils/auth");

/**
 * Middleware to authenticate JWT tokens
 */
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

/**
 * Middleware to check if user has admin role
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Requires admin access" });
  }
};

/**
 * Middleware to check if user is a store owner
 */
const isStoreOwner = (req, res, next) => {
  if (req.user && req.user.role === "owner") {
    next();
  } else {
    res.status(403).json({ message: "Requires store owner access" });
  }
};

/**
 * Middleware to check if user is a normal user
 */
const isUser = (req, res, next) => {
  if (req.user && req.user.role === "user") {
    next();
  } else {
    res.status(403).json({ message: "Requires user access" });
  }
};

/**
 * Middleware to check if user is the owner of a specific store
 */
const isStoreOwnerById = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    // Admin can access any store
    if (req.user.role === "admin") {
      return next();
    }
    
    // For store owners, check if they own the store
    if (req.user.role === "owner") {
      const storeId = req.params.id || req.body.storeId;
      
      if (!storeId) {
        return res.status(400).json({ message: "Store ID is required" });
      }
      
      const { query } = require("../utils/db");
      const store = await query(
        "SELECT * FROM stores WHERE id = ? AND owner_id = ?",
        [storeId, req.user.id]
      );
      
      if (store && store.length > 0) {
        return next();
      }
    }
    
    return res.status(403).json({ message: "Not authorized to access this store" });
  } catch (error) {
    console.error("Store owner verification error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  authenticateToken,
  isAdmin,
  isStoreOwner,
  isUser,
  isStoreOwnerById,
};

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

module.exports = {
  authenticateToken,
  isAdmin,
  isStoreOwner,
  isUser,
};

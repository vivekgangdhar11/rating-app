const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/auth.middleware");
const AdminController = require("../controllers/admin.controller");

const router = express.Router();

// Admin-only middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Apply authentication and admin check to all routes
router.use(authMiddleware);
router.use(adminOnly);

// Validation middleware for store creation
const validateStoreCreation = [
  body("name")
    .isLength({ min: 20, max: 60 })
    .withMessage("Store name must be 20-60 characters"),
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .isLength({ max: 255 })
    .withMessage("Email must be less than 255 characters"),
  body("address")
    .isLength({ min: 1 })
    .withMessage("Address is required")
    .isLength({ max: 400 })
    .withMessage("Address must be less than 400 characters"),
  body("ownerId")
    .notEmpty()
    .withMessage("Owner ID is required")
    .isInt({ min: 1 })
    .withMessage("Owner ID must be a positive integer"),
];

// Admin routes
router.post("/stores", validateStoreCreation, AdminController.createStoreAdmin);
router.get("/users", AdminController.getAllUsers);
router.get("/stores", AdminController.getAllStores);

module.exports = router;

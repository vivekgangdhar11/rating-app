const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const { authenticateToken, isAdmin } = require("../middleware/auth");
const { registerValidation, validate } = require("../middleware/validation");

// Register new user
router.post("/register", registerValidation, validate, UserController.register);

// Login user
router.post("/login", UserController.login);

// Get all users (admin only)
router.get("/", authenticateToken, isAdmin, UserController.getAllUsers);

// Get user profile (authenticated)
router.get("/profile", authenticateToken, UserController.getProfile);

// Update user profile (authenticated)
router.put("/profile", authenticateToken, UserController.updateProfile);

module.exports = router;

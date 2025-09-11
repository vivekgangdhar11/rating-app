const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const { authenticateToken, isAdmin } = require("../middleware/auth");
const { registerValidation, validate } = require("../middleware/validation");
express = require("express");
const router = express.Router();
const User = require("../models/user");
const { comparePassword, generateToken } = require("../utils/auth");
const { authenticateToken, isAdmin } = require("../middleware/auth");
const { registerValidation, validate } = require("../middleware/validation");

// Register new user
router.post("/register", registerValidation, validate, async (req, res) => {
  try {
    const existingUser = await User.findByEmail(req.body.email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create(req.body);
    const token = generateToken({ id: user.id, role: user.role });

    res.status(201).json({ token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByEmail(req.body.email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await comparePassword(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ id: user.id, role: user.role });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
});

// Get all users (admin only)
router.get("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

// Update user profile
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const updated = await User.update(req.user.id, req.body);
    if (updated) {
      res.json({ message: "Profile updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
});

module.exports = router;

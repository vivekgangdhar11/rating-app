const User = require("../models/user");
const { generateToken } = require("../utils/auth");
const { validationResult } = require("express-validator");

/**
 * User Controller - Handles user-related business logic
 */
class UserController {
  /**
   * Register a new user
   */
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const existingUser = await User.findByEmail(req.body.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const user = await User.create(req.body);
      const token = generateToken({ id: user.id, role: user.role });

      res.status(201).json({ token });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({
        message: "Error registering user",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Login user
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findByEmail(email);

      if (!user || !(await User.verifyPassword(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken({ id: user.id, role: user.role });
      res.json({ token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Error logging in" });
    }
  }

  /**
   * Get all users (admin only)
   */
  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Error fetching users" });
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updated = await User.update(userId, req.body);

      if (!updated) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Error updating profile" });
    }
  }

  /**
   * Get user profile from JWT token
   */
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return user details without sensitive information
      const { id, name, email, role, address } = user;
      res.json({ id, name, email, role, address });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ message: "Error fetching profile" });
    }
  }
}

module.exports = UserController;

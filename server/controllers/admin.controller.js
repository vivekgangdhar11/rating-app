const Store = require("../models/store");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const { query } = require("../utils/db");

/**
 * Admin Controller - Handles admin-specific operations
 */
class AdminController {
  /**
   * Create a new store and link it with a store owner (admin only)
   */
  static async createStoreAdmin(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, address, ownerId } = req.body;

      // Validate name length (20-60 chars)
      if (!name || name.length < 20 || name.length > 60) {
        return res.status(400).json({ error: 'Name must be 20–60 characters' });
      }

      // Validate address length (≤400 chars)
      if (!address || address.length > 400) {
        return res.status(400).json({ error: 'Address too long' });
      }

      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Validate that ownerId exists and role === 'owner'
      if (!ownerId) {
        return res.status(400).json({
          error: 'Owner ID is required',
        });
      }

      const ownerUser = await query(
        "SELECT id, role FROM users WHERE id = ?",
        [ownerId]
      );

      if (!ownerUser[0]) {
        return res.status(400).json({
          error: 'Invalid owner ID',
        });
      }

      if (ownerUser[0].role !== "owner") {
        return res.status(400).json({
          error: 'User is not a store owner',
        });
      }

      // Check for duplicate email
      const existingStore = await query(
        "SELECT id FROM stores WHERE email = ?",
        [email]
      );

      if (existingStore[0]) {
        return res.status(400).json({
          error: 'Store with this email already exists',
        });
      }

      // Create the store
      const storeData = { name, email, address };
      const store = await Store.create(storeData, ownerId);

      res.status(201).json({
        message: 'Store created successfully',
        store: store,
      });
    } catch (error) {
      console.error("Create store admin error:", error);
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          message: "Store with this email already exists",
        });
      }
      res.status(500).json({ message: "Error creating store" });
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
   * Get all stores (admin only)
   */
  static async getAllStores(req, res) {
    try {
      const stores = await Store.findAll();
      res.json(stores);
    } catch (error) {
      console.error("Get stores error:", error);
      res.status(500).json({ message: "Error fetching stores" });
    }
  }
}

module.exports = AdminController;

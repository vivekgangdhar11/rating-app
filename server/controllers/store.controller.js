const Store = require("../models/store");
const { validationResult } = require("express-validator");

/**
 * Store Controller - Handles store-related business logic
 */
class StoreController {
  /**
   * Create a new store (store owners and admins)
   */
  static async createStore(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if user is admin or store owner
      if (req.user.role !== "admin" && req.user.role !== "owner") {
        return res.status(403).json({
          message: "Only admins and store owners can create stores",
        });
      }

      // If admin is creating store for another owner
      const ownerId = req.body.owner_id || req.user.id;

      // If admin is creating for another owner, validate owner exists and is a store owner
      if (req.user.role === "admin" && req.body.owner_id) {
        const ownerUser = await query(
          "SELECT id, role FROM users WHERE id = ?",
          [req.body.owner_id]
        );

        if (!ownerUser[0] || ownerUser[0].role !== "owner") {
          return res.status(400).json({
            message: "Invalid owner ID or user is not a store owner",
          });
        }
      }

      const store = await Store.create(req.body, ownerId);
      res.status(201).json(store);
    } catch (error) {
      console.error("Create store error:", error);
      res.status(500).json({ message: "Error creating store" });
    }
  }

  /**
   * Get all stores with average ratings
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

  /**
   * Get store by ID with ratings
   */
  static async getStoreById(req, res) {
    try {
      const store = await Store.findById(req.params.id);
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      res.json(store);
    } catch (error) {
      console.error("Get store error:", error);
      res.status(500).json({ message: "Error fetching store" });
    }
  }

  /**
   * Update store (admin only)
   */
  static async updateStore(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const updated = await Store.update(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Store not found" });
      }
      res.json({ message: "Store updated successfully" });
    } catch (error) {
      console.error("Update store error:", error);
      res.status(500).json({ message: "Error updating store" });
    }
  }

  /**
   * Delete store (admin only)
   */
  static async deleteStore(req, res) {
    try {
      const deleted = await Store.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Store not found" });
      }
      res.json({ message: "Store deleted successfully" });
    } catch (error) {
      console.error("Delete store error:", error);
      res.status(500).json({ message: "Error deleting store" });
    }
  }
}

module.exports = StoreController;

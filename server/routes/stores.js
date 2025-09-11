const express = require("express");
const router = express.Router();
const Store = require("../models/store");
const { authenticateToken, isAdmin } = require("../middleware/auth");
const { storeValidation, validate } = require("../middleware/validation");

// Create store (admin only)
router.post(
  "/",
  authenticateToken,
  isAdmin,
  storeValidation,
  validate,
  async (req, res) => {
    try {
      const store = await Store.create(req.body);
      res.status(201).json(store);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating store", error: error.message });
    }
  }
);

// Get all stores
router.get("/", async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching stores", error: error.message });
  }
});

// Get store by ID
router.get("/:id", async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (store) {
      res.json(store);
    } else {
      res.status(404).json({ message: "Store not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching store", error: error.message });
  }
});

// Update store (admin only)
router.put(
  "/:id",
  authenticateToken,
  isAdmin,
  storeValidation,
  validate,
  async (req, res) => {
    try {
      const updated = await Store.update(req.params.id, req.body);
      if (updated) {
        res.json({ message: "Store updated successfully" });
      } else {
        res.status(404).json({ message: "Store not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating store", error: error.message });
    }
  }
);

// Delete store (admin only)
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const deleted = await Store.delete(req.params.id);
    if (deleted) {
      res.json({ message: "Store deleted successfully" });
    } else {
      res.status(404).json({ message: "Store not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting store", error: error.message });
  }
});

module.exports = router;

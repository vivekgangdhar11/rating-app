const express = require("express");
const router = express.Router();
const StoreController = require("../controllers/store.controller");
const { authenticateToken, isAdmin } = require("../middleware/auth");
const { storeValidation, validate } = require("../middleware/validation");

// Create store (store owners and admins)
router.post(
  "/",
  authenticateToken,
  storeValidation,
  validate,
  StoreController.createStore
);

// Get all stores
router.get("/", StoreController.getAllStores);

// Get store by ID
router.get("/:id", StoreController.getStoreById);

// Update store (admin only)
router.put(
  "/:id",
  authenticateToken,
  isAdmin,
  storeValidation,
  validate,
  StoreController.updateStore
);

// Delete store (admin only)
router.delete("/:id", authenticateToken, isAdmin, StoreController.deleteStore);

module.exports = router;

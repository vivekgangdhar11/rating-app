const express = require("express");
const router = express.Router();
const StoreController = require("../controllers/store.controller");
const RatingController = require("../controllers/rating.controller");
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

// Get all stores (public)
// Get stores by owner (authenticated)
router.get("/", (req, res, next) => {
  // If ownerId is provided, require authentication
  if (req.query.ownerId) {
    return authenticateToken(req, res, next);
  }
  next();
}, StoreController.getAllStores);

// Get store by ID (public)
router.get("/:id", StoreController.getStoreById);

// Rate a store (authenticated users only)
router.post("/:id/rate", authenticateToken, (req, res, next) => {
  // Set storeId from URL params to body
  req.body.storeId = req.params.id;
  
  // Validate score is between 1 and 5
  const { score } = req.body;
  if (!score || score < 1 || score > 5) {
    return res.status(400).json({ error: 'Score must be between 1 and 5' });
  }
  
  // Ensure user role is 'user' for rating submission
  if (req.user.role !== 'user') {
    return res.status(403).json({ error: 'Only regular users can submit ratings' });
  }
  
  next();
}, RatingController.submitRating);

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

const express = require("express");
const router = express.Router();
const RatingController = require("../controllers/rating.controller");
const { authenticateToken, isStoreOwner } = require("../middleware/auth");

// Get all ratings for owner's stores (owner only)
router.get(
  "/ratings",
  authenticateToken,
  isStoreOwner,
  RatingController.getOwnerStoreRatings
);

// Respond to a specific rating (owner only)
router.post(
  "/ratings/:ratingId/respond",
  authenticateToken,
  isStoreOwner,
  RatingController.respondToRating
);

module.exports = router;

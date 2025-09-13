const express = require("express");
const router = express.Router();
const RatingController = require("../controllers/rating.controller");
const {
  authenticateToken,
  isUser,
  isStoreOwner,
} = require("../middleware/auth");
const { ratingValidation, validate } = require("../middleware/validation");

// Submit or update rating (user only)
router.post(
  "/",
  authenticateToken,
  isUser,
  ratingValidation,
  validate,
  RatingController.submitRating
);

// Update rating (user only)
router.put(
  "/",
  authenticateToken,
  isUser,
  ratingValidation,
  validate,
  RatingController.submitRating
);

// Get store ratings (store owner or admin)
router.get("/:storeId", authenticateToken, RatingController.getStoreRatings);

// Get store average rating (public)
router.get("/:storeId/average", RatingController.getAverageRating);

module.exports = router;

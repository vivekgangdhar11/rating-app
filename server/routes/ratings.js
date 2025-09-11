const express = require("express");
const router = express.Router();
const Rating = require("../models/rating");
const {
  authenticateToken,
  isUser,
  isStoreOwner,
} = require("../middleware/auth");
const { ratingValidation, validate } = require("../middleware/validation");

// Submit or update rating (user only)
router.post(
  "/:storeId",
  authenticateToken,
  isUser,
  ratingValidation,
  validate,
  async (req, res) => {
    try {
      const ratingData = {
        userId: req.user.id,
        storeId: parseInt(req.params.storeId),
        score: req.body.score,
      };

      const rating = await Rating.createOrUpdate(ratingData);
      res.status(201).json(rating);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error submitting rating", error: error.message });
    }
  }
);

// Get store ratings (store owner or admin)
router.get("/:storeId", authenticateToken, async (req, res) => {
  try {
    // Allow admin and store owner to view ratings
    if (req.user.role !== "admin" && req.user.role !== "owner") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const ratings = await Rating.getStoreRatings(req.params.storeId);
    res.json(ratings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching ratings", error: error.message });
  }
});

// Get store average rating
router.get("/:storeId/average", async (req, res) => {
  try {
    const average = await Rating.getAverageRating(req.params.storeId);
    res.json({ average });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching average rating", error: error.message });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const RatingController = require("../controllers/rating.controller");
const { authenticateToken, isStoreOwner, isStoreOwnerById } = require("../middleware/auth");

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
  async (req, res, next) => {
    try {
      // Get the rating to verify it belongs to one of the owner's stores
      const { query } = require("../utils/db");
      const rating = await query(
        `SELECT r.* FROM ratings r
         JOIN stores s ON r.store_id = s.id
         WHERE r.id = ? AND s.owner_id = ?`,
        [req.params.ratingId, req.user.id]
      );
      
      if (!rating || rating.length === 0) {
        return res.status(403).json({ message: "Not authorized to respond to this rating" });
      }
      
      next();
    } catch (error) {
      console.error("Rating ownership verification error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  RatingController.respondToRating
);

module.exports = router;

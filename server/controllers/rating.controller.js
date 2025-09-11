const Rating = require("../models/rating");
const { validationResult } = require("express-validator");

/**
 * Rating Controller - Handles rating-related business logic
 */
class RatingController {
  /**
   * Submit or update a rating
   */
  static async submitRating(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { storeId, score } = req.body;

      if (!storeId) {
        return res.status(400).json({ message: "Store ID is required" });
      }

      const ratingData = {
        userId: req.user.id,
        storeId: parseInt(storeId),
        score: score,
      };

      const rating = await Rating.createOrUpdate(ratingData);
      res.status(201).json(rating);
    } catch (error) {
      console.error("Submit rating error:", error);
      res.status(500).json({ message: "Error submitting rating" });
    }
  }

  /**
   * Get all ratings for a store
   */
  static async getStoreRatings(req, res) {
    try {
      const ratings = await Rating.getStoreRatings(req.params.storeId);
      res.json(ratings);
    } catch (error) {
      console.error("Get ratings error:", error);
      res.status(500).json({ message: "Error fetching ratings" });
    }
  }

  /**
   * Get average rating for a store
   */
  static async getAverageRating(req, res) {
    try {
      const average = await Rating.getAverageRating(req.params.storeId);
      res.json({ average });
    } catch (error) {
      console.error("Get average rating error:", error);
      res.status(500).json({ message: "Error fetching average rating" });
    }
  }

  /**
   * Get all ratings for stores owned by the authenticated owner
   */
  static async getOwnerStoreRatings(req, res) {
    try {
      const ownerId = req.user.id;
      const ratings = await Rating.getOwnerStoreRatings(ownerId);
      res.json(ratings);
    } catch (error) {
      console.error("Get owner ratings error:", error);
      res.status(500).json({ message: "Error fetching owner store ratings" });
    }
  }

  /**
   * Add owner's response to a rating
   */
  static async respondToRating(req, res) {
    try {
      const { ratingId } = req.params;
      const { response } = req.body;

      if (
        !response ||
        typeof response !== "string" ||
        response.trim().length === 0
      ) {
        return res.status(400).json({ message: "Response text is required" });
      }

      if (response.length > 1000) {
        return res
          .status(400)
          .json({ message: "Response must not exceed 1000 characters" });
      }

      const updatedRating = await Rating.addOwnerResponse(
        ratingId,
        req.user.id,
        {
          response: response.trim(),
        }
      );

      res.json(updatedRating);
    } catch (error) {
      console.error("Add response error:", error);
      if (error.message === "Rating not found or not authorized") {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Error adding response" });
      }
    }
  }
}

module.exports = RatingController;

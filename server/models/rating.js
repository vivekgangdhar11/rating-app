const { query, beginTransaction, queryTransaction } = require("../utils/db");

class Rating {
  /**
   * Create or update a rating
   * @param {Object} ratingData - Rating data
   * @returns {Promise<Object>} Created/updated rating
   */
  static async createOrUpdate(ratingData) {
    const connection = await beginTransaction();

    try {
      // Check if rating exists
      const existing = await queryTransaction(
        connection,
        "SELECT * FROM ratings WHERE user_id = ? AND store_id = ?",
        [ratingData.userId, ratingData.storeId]
      );

      let result;
      if (existing.length > 0) {
        // Update existing rating
        result = await queryTransaction(
          connection,
          "UPDATE ratings SET score = ? WHERE user_id = ? AND store_id = ?",
          [ratingData.score, ratingData.userId, ratingData.storeId]
        );
        await connection.commit();
        return { ...ratingData, id: existing[0].id };
      } else {
        // Create new rating
        result = await queryTransaction(
          connection,
          "INSERT INTO ratings (user_id, store_id, score) VALUES (?, ?, ?)",
          [ratingData.userId, ratingData.storeId, ratingData.score]
        );
        await connection.commit();
        return { id: result.insertId, ...ratingData };
      }
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  }

  /**
   * Get ratings for a store
   * @param {number} storeId - Store ID
   * @returns {Promise<Array>} List of ratings
   */
  static async getStoreRatings(storeId) {
    return await query(
      `
      SELECT r.*, u.name as user_name, 
             r.created_at as rating_date
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
      ORDER BY r.created_at DESC
    `,
      [storeId]
    );
  }

  /**
   * Get average rating for a store
   * @param {number} storeId - Store ID
   * @returns {Promise<number>} Average rating
   */
  static async getAverageRating(storeId) {
    const rows = await query(
      `
      SELECT 
        ROUND(AVG(score), 2) as average,
        COUNT(*) as total_ratings,
        MIN(score) as lowest_rating,
        MAX(score) as highest_rating
      FROM ratings 
      WHERE store_id = ?
    `,
      [storeId]
    );
    return rows[0];
  }

  /**
   * Get all ratings for stores owned by a specific owner
   * @param {number} ownerId - Owner's user ID
   * @returns {Promise<Array>} List of ratings with store details
   */
  static async getOwnerStoreRatings(ownerId) {
    return await query(
      `
      SELECT 
        r.*,
        u.name as user_name,
        s.name as store_name,
        s.address as store_address,
        r.created_at as rating_date,
        r.updated_at as rating_updated
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      JOIN stores s ON r.store_id = s.id
      WHERE s.owner_id = ?
      ORDER BY r.created_at DESC
    `,
      [ownerId]
    );
  }

  /**
   * Add or update owner's response to a rating
   * @param {number} ratingId - Rating ID
   * @param {number} ownerId - Store owner's user ID
   * @param {Object} responseData - Response data
   * @returns {Promise<Object>} Updated rating with response
   */
  static async addOwnerResponse(ratingId, ownerId, responseData) {
    const connection = await beginTransaction();

    try {
      // First verify the rating exists and belongs to one of the owner's stores
      const [rating] = await queryTransaction(
        connection,
        `
        SELECT r.*, s.owner_id 
        FROM ratings r
        JOIN stores s ON r.store_id = s.id
        WHERE r.id = ? AND s.owner_id = ?
        `,
        [ratingId, ownerId]
      );

      if (!rating) {
        await connection.rollback();
        throw new Error("Rating not found or not authorized");
      }

      // Update the rating with the owner's response
      await queryTransaction(
        connection,
        `
        UPDATE ratings 
        SET 
          owner_response = ?,
          owner_response_date = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [responseData.response, ratingId]
      );

      await connection.commit();

      // Return the updated rating
      const [updatedRating] = await query(
        `
        SELECT 
          r.*,
          u.name as user_name,
          s.name as store_name,
          s.address as store_address
        FROM ratings r
        JOIN users u ON r.user_id = u.id
        JOIN stores s ON r.store_id = s.id
        WHERE r.id = ?
        `,
        [ratingId]
      );

      return updatedRating;
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  }
}

module.exports = Rating;

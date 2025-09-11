const { query } = require("../utils/db");

class Store {
  /**
   * Create a new store
   * @param {Object} storeData - Store data
   * @param {number} ownerId - Owner's user ID
   * @returns {Promise<Object>} Created store
   */
  static async create(storeData, ownerId) {
    const result = await query(
      "INSERT INTO stores (owner_id, name, email, address) VALUES (?, ?, ?, ?)",
      [ownerId, storeData.name, storeData.email, storeData.address]
    );
    return { id: result.insertId, owner_id: ownerId, ...storeData };
  }

  /**
   * Get all stores with average ratings
   * @returns {Promise<Array>} List of stores with ratings
   */
  static async findAll() {
    return await query(`
      SELECT s.*, ROUND(COALESCE(AVG(r.score), 0), 2) as average_rating,
             COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
    `);
  }

  /**
   * Get store by ID with average rating
   * @param {number} id - Store ID
   * @returns {Promise<Object>} Store data
   */
  static async findById(id) {
    const rows = await query(
      `
      SELECT s.*, ROUND(COALESCE(AVG(r.score), 0), 2) as average_rating,
             COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.id = ?
      GROUP BY s.id
    `,
      [id]
    );
    return rows[0];
  }

  /**
   * Update store
   * @param {number} id - Store ID
   * @param {Object} storeData - Updated store data
   * @returns {Promise<boolean>} Success status
   */
  static async update(id, storeData) {
    const result = await query(
      "UPDATE stores SET name = ?, email = ?, address = ? WHERE id = ?",
      [storeData.name, storeData.email, storeData.address, id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Delete store
   * @param {number} id - Store ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    const result = await query("DELETE FROM stores WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Store;

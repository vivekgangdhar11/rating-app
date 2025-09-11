const { query } = require("../utils/db");
const { hashPassword, comparePassword } = require("../utils/auth");

class User {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  static async create(userData) {
    try {
      const hashedPassword = await hashPassword(userData.password);
      console.log("Attempting to create user:", {
        ...userData,
        password: "[REDACTED]",
      });

      const result = await query(
        "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
        [
          userData.name,
          userData.email,
          hashedPassword,
          userData.address,
          userData.role,
        ]
      );

      console.log("User created successfully with ID:", result.insertId);
      return { id: result.insertId, ...userData, password: undefined };
    } catch (error) {
      console.error("Error in user creation:", error);
      if (error.code === "ER_DUP_ENTRY") {
        throw new Error("Email already exists");
      }
      throw error;
    }
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object>} User data
   */
  static async findByEmail(email) {
    const rows = await query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  }

  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>} User data
   */
  static async findById(id) {
    const rows = await query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  }

  /**
   * Get all users (for admin)
   * @returns {Promise<Array>} List of users
   */
  static async findAll() {
    return await query("SELECT id, name, email, address, role FROM users");
  }

  /**
   * Update user
   * @param {number} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<boolean>} Success status
   */
  static async update(id, userData) {
    const result = await query(
      "UPDATE users SET name = ?, address = ? WHERE id = ?",
      [userData.name, userData.address, id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Verify user password
   * @param {string} password - Plain text password
   * @param {string} hashedPassword - Stored hashed password
   * @returns {Promise<boolean>} Whether password matches
   */
  static async verifyPassword(password, hashedPassword) {
    return await comparePassword(password, hashedPassword);
  }
}

module.exports = User;

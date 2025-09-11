/**
 * Database query helper functions
 */
const { pool } = require("../config/database");

/**
 * Execute a SQL query with parameters
 * @param {string} sql - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
const query = async (sql, params = []) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};

/**
 * Begin a transaction
 * @returns {Promise<Connection>} Database connection
 */
const beginTransaction = async () => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  return connection;
};

/**
 * Execute a query within a transaction
 * @param {Connection} connection - Database connection
 * @param {string} sql - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
const queryTransaction = async (connection, sql, params = []) => {
  const [rows] = await connection.execute(sql, params);
  return rows;
};

module.exports = {
  query,
  beginTransaction,
  queryTransaction,
};

const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function initDatabase() {
  let connection;

  try {
    // Connect to MySQL server
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log("Connected to MySQL server");

    // Create database
    await connection.query("DROP DATABASE IF EXISTS rating_app");
    await connection.query(
      "CREATE DATABASE rating_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
    );
    await connection.query("USE rating_app");

    console.log("Database created");

    // Create tables
    await connection.query(`
      CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(400),
        role ENUM('admin', 'user', 'owner') NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CHECK (CHAR_LENGTH(name) BETWEEN 2 AND 60)
      )
    `);

    await connection.query(`
      CREATE TABLE stores (
        id INT PRIMARY KEY AUTO_INCREMENT,
        owner_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        address VARCHAR(400) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE ratings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        store_id INT NOT NULL,
        score INT NOT NULL,
        owner_response TEXT,
        owner_response_date TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_store (user_id, store_id),
        CHECK (score BETWEEN 1 AND 5)
      )
    `);

    console.log("Tables created");

    // Create indexes
    await connection.query("CREATE INDEX idx_users_email ON users(email)");
    await connection.query("CREATE INDEX idx_users_role ON users(role)");
    await connection.query("CREATE INDEX idx_store_owner ON stores(owner_id)");
    await connection.query(
      "CREATE INDEX idx_store_ratings ON ratings(store_id)"
    );
    await connection.query("CREATE INDEX idx_user_ratings ON ratings(user_id)");

    console.log("Indexes created");

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await connection.query(
      `
      INSERT INTO users (name, email, password, role, address)
      VALUES (?, ?, ?, ?, ?)
    `,
      ["System Admin", "admin@example.com", hashedPassword, "admin", "System"]
    );

    console.log("Admin user created");
    console.log("Admin credentials:", {
      email: "admin@example.com",
      password: "admin123",
    });
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase()
  .then(() => {
    console.log("Database initialization completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });

const mysql = require(    // Split SQL file into separate statements and clean them
    const statements = sql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);ql2/promise");
require("dotenv").config();

async function initializeDatabase() {
  let connection;

  try {
    // First connect without database selection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log("Connected to MySQL server");

    // Read the SQL file
    const fs = require("fs");
    const path = require("path");
    const sqlPath = path.join(__dirname, "..", "database.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    // Split SQL file into separate statements
    const statements = sql
      .split(";")
      .filter((statement) => statement.trim().length > 0);

    // Execute each statement
    for (let statement of statements) {
      await connection.query(statement + ";");
      console.log("Executed SQL statement successfully");
    }

    console.log("Database and tables created successfully");

    // Create an admin user if it doesn't exist
    const adminEmail = "admin@example.com";
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await connection.query(`
      INSERT IGNORE INTO users (name, email, password, role, address)
      VALUES (
        'System Admin',
        '${adminEmail}',
        '${hashedPassword}',
        'admin',
        'System'
      )
    `);

    console.log("Admin user created or already exists");
    console.log("Admin credentials:", {
      email: adminEmail,
      password: "admin123",
    });
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the initialization
initializeDatabase().then(() => {
  console.log("Database initialization complete");
  process.exit(0);
});

const bcrypt = require("bcryptjs");
const { query } = require("../utils/db");

async function createTestData() {
  try {
    // 1. Create a store owner with hashed password
    const hashedOwnerPassword = await bcrypt.hash("owner123", 10);
    const ownerResult = await query(
      `INSERT INTO users (name, email, password, role, address) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        "Test Store Owner",
        "owner@test.com",
        hashedOwnerPassword,
        "owner",
        "456 Owner St",
      ]
    );
    const ownerId = ownerResult.insertId;
    console.log("Created store owner:", {
      id: ownerId,
      email: "owner@test.com",
      password: "owner123",
    });

    // 2. Create multiple stores for the owner
    const store1Result = await query(
      `INSERT INTO stores (owner_id, name, email, address) 
       VALUES (?, ?, ?, ?)`,
      [ownerId, "Coffee Shop", "coffee@test.com", "789 Store St #1"]
    );
    const store1Id = store1Result.insertId;
    console.log("Created Coffee Shop:", { id: store1Id });

    const store2Result = await query(
      `INSERT INTO stores (owner_id, name, email, address) 
       VALUES (?, ?, ?, ?)`,
      [ownerId, "Bakery", "bakery@test.com", "789 Store St #2"]
    );
    const store2Id = store2Result.insertId;
    console.log("Created Bakery:", { id: store2Id });

    // 3. Create multiple users with hashed passwords
    const hashedUserPassword = await bcrypt.hash("user123", 10);
    const user1Result = await query(
      `INSERT INTO users (name, email, password, role, address) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        "John Smith",
        "user1@test.com",
        hashedUserPassword,
        "user",
        "123 User St #1",
      ]
    );
    const user1Id = user1Result.insertId;

    const user2Result = await query(
      `INSERT INTO users (name, email, password, role, address) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        "Jane Doe",
        "user2@test.com",
        hashedUserPassword,
        "user",
        "123 User St #2",
      ]
    );
    const user2Id = user2Result.insertId;
    console.log("Created test users:", { user1Id, user2Id });

    // 4. Create multiple ratings with different scores and some owner responses
    // Ratings for Coffee Shop
    await query(
      `INSERT INTO ratings (user_id, store_id, score, owner_response, owner_response_date) 
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        user1Id,
        store1Id,
        5,
        "Thank you for your wonderful review! We're glad you enjoyed our coffee.",
      ]
    );

    await query(
      `INSERT INTO ratings (user_id, store_id, score) 
       VALUES (?, ?, ?)`,
      [user2Id, store1Id, 4]
    );

    // Ratings for Bakery
    await query(
      `INSERT INTO ratings (user_id, store_id, score) 
       VALUES (?, ?, ?)`,
      [user1Id, store2Id, 3]
    );

    await query(
      `INSERT INTO ratings (user_id, store_id, score, owner_response, owner_response_date) 
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        user2Id,
        store2Id,
        5,
        "Thank you for visiting our bakery! We appreciate your feedback.",
      ]
    );

    console.log("Created test ratings for both stores");

    console.log("\nTest Data Summary:");
    console.log("------------------");
    console.log("Store Owner Login:");
    console.log("Email: owner@test.com");
    console.log("Password: owner123");
    console.log("\nTest Users Login:");
    console.log("Email: user1@test.com or user2@test.com");
    console.log("Password: user123");
  } catch (error) {
    console.error("Error creating test data:", error);
  }
  process.exit(0);
}

createTestData();

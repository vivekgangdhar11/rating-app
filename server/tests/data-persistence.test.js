/**
 * Data Persistence Test Script
 * 
 * This script tests the data persistence in MySQL for the rating app.
 * It verifies that data is properly stored and retrieved from the database.
 */

const { query } = require('../utils/db');

// Test user data
const testUsers = [
  { name: 'Admin User', email: 'admin@test.com', password: 'password123', role: 'admin' },
  { name: 'Store Owner', email: 'owner@test.com', password: 'password123', role: 'owner' },
  { name: 'Regular User', email: 'user@test.com', password: 'password123', role: 'user' }
];

// Test store data
const testStore = {
  name: 'Test Store',
  email: 'store@test.com',
  address: '123 Test St',
  description: 'A test store for testing purposes'
};

// Test rating data
const testRating = {
  score: 4,
  comment: 'Great store!'
};

async function runTests() {
  console.log('Starting data persistence tests...');
  let userId, ownerId, adminId, storeId, ratingId;

  try {
    // Clean up any existing test data
    await cleanup();

    // Test 1: Create users
    console.log('\nTest 1: Creating users...');
    for (const user of testUsers) {
      const result = await query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [user.name, user.email, user.password, user.role]
      );
      
      if (user.role === 'admin') adminId = result.insertId;
      else if (user.role === 'owner') ownerId = result.insertId;
      else if (user.role === 'user') userId = result.insertId;
      
      console.log(`Created ${user.role} user with ID: ${result.insertId}`);
    }

    // Test 2: Create store with owner
    console.log('\nTest 2: Creating store with owner...');
    const storeResult = await query(
      'INSERT INTO stores (owner_id, name, email, address, description) VALUES (?, ?, ?, ?, ?)',
      [ownerId, testStore.name, testStore.email, testStore.address, testStore.description]
    );
    storeId = storeResult.insertId;
    console.log(`Created store with ID: ${storeId}`);

    // Test 3: Submit rating
    console.log('\nTest 3: Submitting rating...');
    const ratingResult = await query(
      'INSERT INTO ratings (user_id, store_id, score, comment) VALUES (?, ?, ?, ?)',
      [userId, storeId, testRating.score, testRating.comment]
    );
    ratingId = ratingResult.insertId;
    console.log(`Created rating with ID: ${ratingId}`);

    // Test 4: Owner responds to rating
    console.log('\nTest 4: Owner responding to rating...');
    await query(
      'UPDATE ratings SET owner_response = ? WHERE id = ?',
      ['Thank you for your feedback!', ratingId]
    );
    console.log('Added owner response to rating');

    // Test 5: Verify store retrieval by owner
    console.log('\nTest 5: Verifying store retrieval by owner...');
    const ownerStores = await query(
      'SELECT * FROM stores WHERE owner_id = ?',
      [ownerId]
    );
    console.log(`Found ${ownerStores.length} stores for owner ID ${ownerId}`);
    if (ownerStores.length !== 1) throw new Error('Expected 1 store for owner');

    // Test 6: Verify ratings retrieval for store
    console.log('\nTest 6: Verifying ratings retrieval for store...');
    const storeRatings = await query(
      'SELECT * FROM ratings WHERE store_id = ?',
      [storeId]
    );
    console.log(`Found ${storeRatings.length} ratings for store ID ${storeId}`);
    if (storeRatings.length !== 1) throw new Error('Expected 1 rating for store');

    // Test 7: Verify store ratings summary view
    console.log('\nTest 7: Verifying store ratings summary view...');
    const ratingSummary = await query(
      'SELECT * FROM store_ratings_summary WHERE id = ?',
      [storeId]
    );
    console.log('Store rating summary:', ratingSummary[0]);
    if (ratingSummary[0].total_ratings !== 1) throw new Error('Expected 1 total rating in summary');
    if (ratingSummary[0].average_rating !== '4.00') throw new Error('Expected average rating of 4.00 in summary');

    console.log('\nAll tests passed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Clean up test data
    await cleanup();
  }
}

async function cleanup() {
  try {
    // Delete test data in reverse order of dependencies
    await query('DELETE FROM ratings WHERE comment = ?', [testRating.comment]);
    await query('DELETE FROM stores WHERE name = ?', [testStore.name]);
    for (const user of testUsers) {
      await query('DELETE FROM users WHERE email = ?', [user.email]);
    }
    console.log('Test data cleaned up');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

// Run the tests
runTests();
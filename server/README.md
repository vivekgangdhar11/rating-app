# Rating App Backend

Express.js backend server for the Rating App with MySQL database.

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## Setup Instructions

### 1. Environment Configuration

1. Copy the environment template to create your `.env` file:

   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your specific values:

   ```env
   PORT=5000                 # Server port
   DB_HOST=localhost        # MySQL host
   DB_USER=your_username    # MySQL username
   DB_PASSWORD=your_pass    # MySQL password
   DB_NAME=rating_app      # Database name
   JWT_SECRET=your_secret  # JWT secret key
   ```

   Generate a secure JWT secret:

   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

### 2. Database Setup

1. Log in to MySQL and create the database:

   ```bash
   mysql -u your_username -p < database.sql
   ```

   This will:

   - Create the rating_app database
   - Set up all required tables
   - Create indexes and constraints
   - Create the store_ratings_summary view

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Overview

### Authentication

- POST /api/users/register - Register new user
- POST /api/users/login - Login user

### Stores

- GET /api/stores - List all stores
- POST /api/stores - Create store (Admin)
- GET /api/stores/:id - Get store
- PUT /api/stores/:id - Update store (Admin)
- DELETE /api/stores/:id - Delete store (Admin)

### Ratings

- POST /api/ratings/:storeId - Submit rating (User)
- GET /api/ratings/:storeId - View ratings (Admin/Owner)
- GET /api/ratings/:storeId/average - Get average rating

## Models

### User

- id: Auto-increment
- name: String (20-60 chars)
- email: String (unique)
- password: String (hashed)
- address: String (max 400 chars)
- role: Enum ('admin', 'user', 'owner')

### Store

- id: Auto-increment
- name: String
- email: String (unique)
- address: String
- average_rating: Computed

### Rating

- id: Auto-increment
- userId: Foreign key
- storeId: Foreign key
- score: Number (1-5)

## Security Features

- Password hashing with bcrypt
- JWT authentication
- Role-based access control
- Input validation
- SQL injection prevention
- CORS enabled

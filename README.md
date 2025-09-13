# Rating App

A full-stack web application that allows users to rate stores, store owners to manage their stores, and administrators to oversee the entire system. Built with React, Express, and MySQL.

**This project was developed as part of a FullStack Intern Coding Challenge.  
I implemented the full assignment requirements including authentication, role-based access control, dashboards for Admin/Owner/User, rating system, and database integration.**

## Features

- User registration and authentication
- Store management (CRUD operations for admins and owners)
- Rating system (users can rate stores 1-5 stars)
- Role-based access control (Admin, Owner, User)
- Dashboards for different user roles
- Secure API with JWT authentication

## Tech Stack

### Frontend

- React (Vite)
- React Router DOM
- Axios
- Material-UI
- Tailwind CSS
- Emotion (for styled components)

### Backend

- Node.js
- Express
- MySQL2
- bcryptjs (password hashing)
- jsonwebtoken (JWT auth)
- express-validator (input validation)
- CORS
- Dotenv
- Nodemon (development)

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## Project Structure

```
rating-app/
├── client/           # React frontend
│   ├── src/         # Source files
│   │   ├── components/
│   │   ├── pages/
│   │   ├── state/
│   │   └── utils/
│   ├── public/      # Static files
│   └── ...
└── server/          # Express backend
    ├── config/      # Database and setup configs
    ├── controllers/ # Route controllers
    ├── middleware/  # Custom middleware
    ├── models/      # Data models
    ├── routes/      # API routes
    ├── utils/       # Utility functions
    ├── tests/       # Test files
    ├── index.js     # Server entry point
    └── ...
```

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/vivekgangdhar11/rating-app.git
   cd rating-app
   ```

2. Setup Database:

   - Install and start MySQL
   - Create a database named `rating_app`
   - Run the database setup script:

     ```bash
     cd server
     mysql -u your_username -p < database.sql
     ```

3. Setup Backend:

   ```bash
   cd server
   npm install
   # Create .env file with your configuration (see Environment Variables section)
   npm run dev
   ```

   Backend will run on http://localhost:5000

4. Setup Frontend:

   ```bash
   cd client
   npm install
   npm run dev
   ```

   Frontend will run on http://localhost:5173

## Environment Variables

### Backend (.env in server/)

```
PORT=5000
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=rating_app
JWT_SECRET=your_secret_key
```

Generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## API Documentation

### Authentication

- POST /api/users/register - Register new user
- POST /api/users/login - Login user

### Stores

- GET /api/stores - List all stores
- POST /api/stores - Create store (Admin)
- GET /api/stores/:id - Get store details
- PUT /api/stores/:id - Update store (Admin/Owner)
- DELETE /api/stores/:id - Delete store (Admin)

### Ratings

- POST /api/ratings/:storeId - Submit rating (User)
- GET /api/ratings/:storeId - View ratings for a store
- GET /api/ratings/:storeId/average - Get average rating for a store

### Owners

- GET /api/owners/stores - Get stores owned by the logged-in owner
- PUT /api/owners/stores/:id - Update owned store

### Admin

- GET /api/admin/users - List all users
- GET /api/admin/stores - List all stores
- GET /api/admin/ratings - List all ratings

## Database Models

### User

- id: Auto-increment primary key
- name: String (20-60 characters)
- email: String (unique)
- password: String (hashed)
- address: String (max 400 characters)
- role: Enum ('admin', 'user', 'owner')

### Store

- id: Auto-increment primary key
- name: String
- email: String (unique)
- address: String
- ownerId: Foreign key to User

### Rating

- id: Auto-increment primary key
- userId: Foreign key to User
- storeId: Foreign key to Store
- score: Integer (1-5)

## Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend

- `npm run dev` - Start development server with Nodemon
- `npm start` - Start production server
- `npm test` - Run tests (currently not implemented)

## Testing

The backend includes a tests directory with data persistence tests. To run tests:

```bash
cd server
npm test
```

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- SQL injection prevention
- CORS configuration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Future Improvements

- Implement unit and integration tests for backend and frontend
- Add password reset and account recovery feature
- Containerize the application with Docker for easier deployment
- Set up CI/CD pipeline for automated testing and deployment

## License

This project is licensed under the ISC License.

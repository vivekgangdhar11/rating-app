# Rating App

A full-stack web application that allows users to rate stores, store owners to manage their stores, and administrators to oversee the entire system. Built with **React**, **Express**, and **MySQL**.

**This project was developed as part of a FullStack Intern Coding Challenge.  
It implements authentication, role-based access control, dashboards for Admin/Owner/User, a rating system, and automatic database integration.**

---

## Features

- Automatic database and table creation on server start
- Pre-created Admin account:
  - **Email:** `admin@example.com`
  - **Password:** `admin123`
- User registration and authentication
- Store management (CRUD for Admins and Owners)
- Rating system (users can rate stores 1–5 stars)
- Role-based access control (Admin, Owner, User)
- Dashboards for different user roles
- Secure API with JWT authentication

---

## Working Flow

1. **Admin Login**
    - Use the pre-created Admin account:
      - **Email:** `admin@example.com`
      - **Password:** `admin123`
    - Admin can:
      - View all users, stores, and ratings
      - Create new stores (assign to Owners)
      - Delete any store
2. **Store Owner Signup / Login**
    - Register with role = `owner`
    - Owners can view their assigned stores and ratings
3. **User Signup / Login**
    - Register with role = `user`
    - Users can view stores and submit ratings (1–5 stars)
4. **Store Creation**
    - Only Admin can create stores and assign to Owners
5. **Rating Flow**
    - Users submit ratings for stores
    - Store’s average rating is calculated automatically
    - Owners and Admins can view all ratings

---

## Example Usage Order

1. Admin logs in using the pre-created account
2. Sign up an Owner (role = `owner`)
3. Admin creates a Store and assigns it to the Owner
4. Sign up a User (role = `user`)
5. User browses stores and submits ratings
6. Owner views ratings for their stores
7. Admin oversees all activities in the dashboard

---

## Tech Stack

**Frontend:**
- React (Vite)
- React Router DOM
- Axios
- Material-UI
- Tailwind CSS
- Emotion (styled components)

**Backend:**
- Node.js, Express
- MySQL2 (auto DB creation)
- bcryptjs, jsonwebtoken
- express-validator
- CORS, dotenv
- Nodemon (dev)

---

## Prerequisites

- Node.js (v14+)
- MySQL (v8+)
- npm or yarn

---

## Project Structure

```
rating-app/
├── README.md
├── client/ # React frontend
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── OwnerDashboard.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── UserDashboard.jsx
│   │   ├── state/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.js
│   ├── test-env.js
│   └── vite.config.js
└── server/ # Express backend
    ├── config/
    │   ├── create-test-data.js
    │   ├── database.js
    │   ├── init-db.js
    │   └── setup-db.js
    ├── controllers/
    │   ├── admin.controller.js
    │   ├── rating.controller.js
    │   ├── store.controller.js
    │   └── user.controller.js
    ├── middleware/
    │   ├── auth.js
    │   ├── auth.middleware.js
    │   ├── password-validation.js
    │   └── validation.js
    ├── models/
    │   ├── rating.js
    │   ├── store.js
    │   └── user.js
    ├── routes/
    │   ├── admin.routes.js
    │   ├── owner.routes.js
    │   ├── rating.routes.js
    │   ├── ratings.js
    │   ├── store.routes.js
    │   ├── stores.js
    │   ├── user.routes.js
    │   └── users.js
    ├── seeders/
    ├── tests/
    │   └── data-persistence.test.js
    ├── utils/
    │   ├── auth.js
    │   └── db.js
    ├── .gitignore
    ├── database.sql
    ├── index.js
    ├── package.json
    ├── package-lock.json
    └── README.md
```

---

## Getting Started

### Clone the repository

```bash
git clone https://github.com/vivekgangdhar11/rating-app.git
cd rating-app
```

### Setup Backend

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file (see Environment Variables section below).

4. Set up the database:

   - Ensure MySQL is running.
   - The backend will automatically create the `rating_app` database, all tables, indexes, and the `store_ratings_summary` view when the server starts.
   - ⚠️ Optional: To manually reset or seed the database, you can run:
     ```bash
     mysql -u your_username -p < database.sql
     ```

5. Start the server:

   - Development mode (with auto-reload):

     ```bash
     npm run dev
     ```

   - Production mode:

     ```bash
     npm start
     ```

   The backend will run at: http://localhost:5000

### Setup Frontend

1. Open a new terminal and navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The frontend will run at: http://localhost:5173

---

## Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

```
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=rating_app
JWT_SECRET=your_secret_key
```

To generate a secure JWT secret, run:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## API Documentation

**Authentication**
- `POST /api/users/register` – Register new user
- `POST /api/users/login` – Login user

**Stores**
- `GET /api/stores` – List stores
- `POST /api/stores` – Create store (Admin)
- `GET /api/stores/:id` – Get store details
- `PUT /api/stores/:id` – Update store
- `DELETE /api/stores/:id` – Delete store (Admin)

**Ratings**
- `POST /api/ratings/:storeId` – Submit rating (User)
- `GET /api/ratings/:storeId` – View ratings for a store
- `GET /api/ratings/:storeId/average` – Get average rating

**Owners**
- `GET /api/owners/stores` – Get stores owned by logged-in Owner
- `PUT /api/owners/stores/:id` – Update owned store

**Admin**
- `GET /api/admin/users` – List all users
- `GET /api/admin/stores` – List all stores
- `GET /api/admin/ratings` – List all ratings

---

## Database Models

**User:**
`id`, `name`, `email`, `password`, `address`, `role` (admin, user, owner)

**Store:**
`id`, `name`, `email`, `address`, `ownerId` (FK → User), `average_rating` (computed)

**Rating:**
`id`, `userId` (FK), `storeId` (FK), `score` (1–5)

---

## Available Scripts

**Frontend:**
- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run preview` – Preview production build
- `npm run lint` – Run ESLint

**Backend:**
- `npm run dev` – Start server with nodemon
- `npm start` – Start server in production
- `npm test` – Run tests (currently placeholder)

---

## Security Features

- Password hashing with bcrypt
- JWT authentication
- Role-based access control
- Input validation and sanitization
- SQL injection prevention
- CORS configuration

---

## Contributing

1. Fork the repo
2. Create a branch
3. Commit changes
4. Push
5. Open a PR

---

## Future Improvements

- Unit and integration tests
- Password reset and account recovery
- Dockerize project
- CI/CD pipeline

## License

ISC License

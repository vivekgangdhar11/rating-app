# Rating App

A full-stack web application built with React, Express, and MySQL.

## Tech Stack

### Frontend

- React (Vite)
- React Router DOM
- Axios
- Material-UI
- Emotion (for styled components)

### Backend

- Node.js
- Express
- MySQL2
- CORS
- Dotenv
- Nodemon (development)

## Project Structure

```
rating-app/
├── client/           # React frontend
│   ├── src/         # Source files
│   ├── public/      # Static files
│   └── ...
└── server/          # Express backend
    ├── index.js     # Server entry point
    └── ...
```

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/vivekgangdhar11/rating-app.git
   cd rating-app
   ```

2. Setup Frontend:

   ```bash
   cd client
   npm install
   npm run dev
   ```

   Frontend will run on http://localhost:5173

3. Setup Backend:
   ```bash
   cd server
   npm install
   # Create .env file with your configuration
   npm run dev
   ```
   Backend will run on http://localhost:5000

## Environment Variables

### Backend (.env)

```
PORT=5000
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=rating_app
```

## Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend

- `npm run dev` - Start development server with Nodemon
- `npm start` - Start production server

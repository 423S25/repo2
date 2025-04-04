# HRDC Login System

A full-stack user authentication system built with React (Mantine UI) and Node.js/Express.

## Tech Stack

- **Frontend**: React.js, Mantine UI, Axios
- **Backend**: Node.js, Express.js
- **Database**: MySQL

## Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- Profile page
- Modern responsive UI with Mantine

## Prerequisites

- Node.js (v14+)
- MySQL database

## Setup Instructions

### Database Setup

1. Create a MySQL database named `hrdc_login`
2. The application will automatically create the required tables on first run

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=hrdc_login
   JWT_SECRET=your_secret_key
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd backend/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

- `POST /api/register` - Register a new user
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile (protected route)

## License

MIT
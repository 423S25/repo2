# Login System

A complete user authentication system built with React, Node.js, Express, and MySQL.

## Features

- User registration with validation
- User login with JWT authentication
- Protected routes
- Profile page
- Modern UI with Mantine components

## Technologies Used

### Frontend
- React
- React Router DOM
- Mantine UI components
- Axios for API requests

### Backend
- Node.js
- Express.js
- MySQL database
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v14+ recommended)
- MySQL server

### Database Setup

1. Make sure your MySQL server is running
2. Run the SQL script to create the database and tables:

```bash
mysql -u root -p < server/database.sql
```

### Backend Setup

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
   - Rename `.env.example` to `.env` (or copy it)
   - Update the database credentials and JWT secret

4. Start the server:

```bash
node server.js
```

The server will run on http://localhost:5000.

### Frontend Setup

1. Navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The application will open in your browser at http://localhost:3000.

## Project Structure

```
login-system/
├── client/                  # Frontend
│   ├── public/              # Static files
│   └── src/                 # React source files
│       ├── components/      # Reusable components
│       ├── contexts/        # Context providers
│       ├── pages/           # Page components
│       └── services/        # API services
└── server/                  # Backend
    ├── database.sql         # Database setup script
    └── server.js            # Express server
```

## License

MIT
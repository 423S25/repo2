#!/bin/bash

# Start backend server
echo "Starting Backend Server..."
cd backend
npm run dev &
BACKEND_PID=$!

# Start frontend server
echo "Starting Frontend Server..."
cd frontend
npm start &
FRONTEND_PID=$!

# Handle termination
trap 'echo "Shutting down servers..."; kill $BACKEND_PID $FRONTEND_PID; exit' INT

# Keep script running
wait
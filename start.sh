#!/bin/sh

# Start backend first
cd /app/backend
PORT=$BACKEND_PORT npm start &

# Wait a moment for backend to start
sleep 2

# Start frontend
cd /app/frontend
PORT=$PORT serve -s build &

# Wait for any process to exit
wait 
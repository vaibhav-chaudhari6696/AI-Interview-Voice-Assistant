#!/bin/sh

# Start backend first
cd /app/backend
PORT=$BACKEND_PORT npm start &

# Wait for backend to be ready (using sleep since we know the port)
echo "Waiting for backend to start..."
sleep 5

# Start frontend
cd /app/frontend
PORT=$PORT serve -s build &

# Wait for any process to exit
wait 
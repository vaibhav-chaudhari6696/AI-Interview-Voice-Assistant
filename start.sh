#!/bin/sh

# Start backend first
cd /app/backend
PORT=$BACKEND_PORT npm start &

# Wait for backend to be ready
echo "Waiting for backend to start..."
while ! wget -q --spider http://localhost:$BACKEND_PORT/health; do
    sleep 1
done
echo "Backend is ready!"

# Start frontend
cd /app/frontend
PORT=$PORT serve -s build &

# Wait for any process to exit
wait 
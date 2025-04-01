#!/bin/sh

# Start backend
cd /app/backend
PORT=9999 npm start &

# Start frontend
cd /app/frontend
PORT=$PORT serve -s build &

# Wait for any process to exit
wait 
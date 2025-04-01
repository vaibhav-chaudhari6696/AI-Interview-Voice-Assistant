#!/bin/sh

# Start backend
cd /app/backend
npm start &

# Start frontend
cd /app/frontend
serve -s build -l 3000 &

# Wait for any process to exit
wait 
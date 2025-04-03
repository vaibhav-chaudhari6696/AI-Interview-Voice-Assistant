#!/bin/bash

# Get the port from Render's environment variable (this will be 10000)
RENDER_PORT=${PORT:-10000}

# Build the frontend
cd /app/frontend
npm run build

# Start the backend service (will use PORT-1 from backend's environment)
cd /app/backend
npm start &

# Serve the frontend build on Render's port (10000)
cd /app/frontend
npx serve -s build -l $RENDER_PORT &

# Wait for all background processes to complete
wait 

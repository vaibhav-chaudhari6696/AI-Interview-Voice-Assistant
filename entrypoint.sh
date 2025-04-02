#!/bin/bash

# Get the port from Render's environment variable
RENDER_PORT=${PORT:-3000}

# Start the backend service
cd /app/backend
PORT=$RENDER_PORT npm start &

# Start the frontend service
cd /app/frontend
REACT_APP_API_URL=http://localhost:$RENDER_PORT PORT=$((RENDER_PORT + 1)) npm start &

# Wait for all background processes to complete
wait 

#!/bin/bash

# Get the port from Render's environment variable
RENDER_PORT=${PORT:-10000}

# Start the backend service
cd /app/backend
PORT=9999 npm start &

# Start the frontend service
cd /app/frontend
REACT_APP_API_URL=http://localhost:9999 PORT=10000 npm start &

# Wait for all background processes to complete
wait 

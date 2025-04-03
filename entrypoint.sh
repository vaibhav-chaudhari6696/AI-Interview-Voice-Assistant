#!/bin/bash

# Get the port from Render's environment variable
RENDER_PORT=${PORT:-3000}

# Start the backend service on a different port
cd /app/backend
PORT=9999 npm start &

# Start the frontend service on Render's port
cd /app/frontend
REACT_APP_API_URL=http://localhost:9999 PORT=$RENDER_PORT HOST=0.0.0.0 npm start &

# Wait for all background processes to complete
wait 

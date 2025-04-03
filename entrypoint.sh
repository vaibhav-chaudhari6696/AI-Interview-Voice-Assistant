#!/bin/bash

# Get the port from Render's environment variable
RENDER_PORT=${PORT:-3000}

# Start the backend service on a different port
cd /app/backend
PORT=$((RENDER_PORT + 1)) npm start &

# Build and serve the frontend on Render's port
cd /app/frontend
REACT_APP_API_URL=http://localhost:$((RENDER_PORT + 1)) npm run build
npx serve -s build -l $RENDER_PORT &

# Wait for all background processes to complete
wait 

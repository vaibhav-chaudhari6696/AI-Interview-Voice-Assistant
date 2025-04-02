#!/bin/bash

# Start the backend service
cd /app/backend
PORT=$BACKEND_PORT npm start &

# Start the frontend service
cd /app/frontend
REACT_APP_API_URL=http://localhost:$BACKEND_PORT PORT=$FRONTEND_PORT npm start &

# Wait for all background processes to complete
wait 

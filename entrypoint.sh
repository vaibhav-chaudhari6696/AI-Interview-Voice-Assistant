#!/bin/bash

# Start the backend service
cd /app/backend
npm start &

# Start the frontend service
cd /app/frontend
npm start &

# Wait for all background processes to complete
wait 
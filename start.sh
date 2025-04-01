#!/bin/sh

# Set default API URL if not provided
if [ -z "$API_URL" ]; then
    export API_URL="http://localhost:9999"
fi

# Start backend
cd /app/backend && PORT=9999 npm start &

# Wait for backend to be ready
echo "Waiting for backend to start..."
sleep 5

# Start frontend with environment variable replacement
cd /app/frontend && ./start-frontend.sh 
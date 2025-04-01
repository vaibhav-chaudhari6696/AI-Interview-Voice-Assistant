# Use Node.js as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Create directories for frontend and backend
RUN mkdir -p /app/frontend /app/backend

# Copy package.json files
COPY ./frontend/package*.json ./frontend/
COPY ./backend/package*.json ./backend/

# Install dependencies
WORKDIR /app/frontend
RUN npm install
RUN npm install react-icons

WORKDIR /app/backend
RUN npm install

# Copy application code
WORKDIR /app
COPY ./frontend ./frontend/
COPY ./backend ./backend/

# Install supervisord to manage multiple processes
RUN apk add --no-cache supervisor

# Configure supervisord
RUN mkdir -p /etc/supervisor/conf.d
COPY supervisord.conf /etc/supervisor/supervisord.conf

# Expose ports
EXPOSE 3000 9999

# Start services using supervisord
CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]
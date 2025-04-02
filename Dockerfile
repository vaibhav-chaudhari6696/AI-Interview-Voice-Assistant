# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files for backend
COPY backend/package*.json ./backend/

# Copy package files for frontend
COPY frontend/package*.json ./frontend/

# Install dependencies for both services
WORKDIR /app/backend
RUN npm install

WORKDIR /app/frontend
RUN npm install

# Copy backend source code
WORKDIR /app/backend
COPY backend/ .

# Copy frontend source code
WORKDIR /app/frontend
COPY frontend/ .

# Copy entrypoint script
COPY ./entrypoint.sh /app/
RUN chmod +x /app/entrypoint.sh

# Expose ports for both services
EXPOSE 3000 5000

# Set the entrypoint script
ENTRYPOINT ["sh", "/app/entrypoint.sh"]
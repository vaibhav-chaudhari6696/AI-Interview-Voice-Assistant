# Use the backend Dockerfile as the main service
FROM node:18-alpine

WORKDIR /app

# Copy backend files
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

# Expose backend port
EXPOSE 9999

# Start backend service
CMD ["npm", "start"] 
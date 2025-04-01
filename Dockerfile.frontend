# Build stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

RUN npm install react-icons

# Copy source code
COPY frontend/ .

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 
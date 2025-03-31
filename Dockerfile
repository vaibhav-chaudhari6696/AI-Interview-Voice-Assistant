# Build stage for frontend
FROM node:18-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Build stage for backend
FROM node:18-alpine as backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy frontend build
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Copy backend
COPY --from=backend-build /app/backend ./backend

# Install production dependencies
WORKDIR /app/backend
RUN npm install --production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Create necessary directories
RUN mkdir -p /app/frontend/build

# Expose port
EXPOSE 3000

# Use tini for proper process management
RUN apk add --no-cache tini

# Start the application with tini
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "src/index.js"] 
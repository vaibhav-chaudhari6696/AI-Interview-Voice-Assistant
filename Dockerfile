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

# Final stage
FROM node:18-alpine
WORKDIR /app

# Copy frontend build
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Copy backend
COPY --from=backend-build /app/backend ./backend

# Install production dependencies for backend
WORKDIR /app/backend
RUN npm install --production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "src/index.js"] 
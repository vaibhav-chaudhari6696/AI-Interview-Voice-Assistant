# Build Frontend
FROM node:18-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
RUN npm install react-icons
COPY frontend/ .
RUN npm run build

# Build Backend
FROM node:18-alpine as backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

# Production
FROM node:18-alpine
WORKDIR /app

# Copy backend
COPY --from=backend-build /app/backend ./backend

# Copy frontend build
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Install serve to serve frontend
RUN npm install -g serve

# Set environment variables for ports and API URL
ENV PORT=10000
ENV BACKEND_PORT=10001
ENV REACT_APP_API_URL=http://localhost:10001
EXPOSE $PORT

# Start both services using a shell script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"] 
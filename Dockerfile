# Build stage for frontend
FROM node:18-alpine as frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
RUN npm install react-icons
COPY frontend/ .

# Create a script to replace environment variables at runtime
RUN echo '#!/bin/sh\n\
sed -i "s|REACT_APP_API_URL=.*|REACT_APP_API_URL=$API_URL|g" /app/frontend/build/static/js/*.js\n\
serve -s build -l 3000' > /app/frontend/start-frontend.sh && \
chmod +x /app/frontend/start-frontend.sh

RUN npm run build

# Build stage for backend
FROM node:18-alpine as backend-builder

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

# Final stage
FROM node:18-alpine

WORKDIR /app

# Copy frontend build
COPY --from=frontend-builder /app/frontend/build ./frontend/build
COPY --from=frontend-builder /app/frontend/start-frontend.sh ./frontend/start-frontend.sh
COPY --from=frontend-builder /app/frontend/package*.json ./frontend/

# Copy backend
COPY --from=backend-builder /app/backend ./backend

# Install serve for frontend
RUN npm install -g serve

# Copy start script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expose ports
EXPOSE 9999
EXPOSE 3000

# Environment variables
ENV PORT=9999
ENV NODE_ENV=production

# Start both services
CMD ["/app/start.sh"] 
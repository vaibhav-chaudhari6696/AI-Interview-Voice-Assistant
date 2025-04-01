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

# Create supervisord config file directly
RUN echo '[supervisord]' > /etc/supervisor/supervisord.conf && \
    echo 'nodaemon=true' >> /etc/supervisor/supervisord.conf && \
    echo 'user=root' >> /etc/supervisor/supervisord.conf && \
    echo 'logfile=/var/log/supervisor/supervisord.log' >> /etc/supervisor/supervisord.conf && \
    echo 'pidfile=/var/run/supervisord.pid' >> /etc/supervisor/supervisord.conf && \
    echo '' >> /etc/supervisor/supervisord.conf && \
    echo '[program:frontend]' >> /etc/supervisor/supervisord.conf && \
    echo 'command=npm start' >> /etc/supervisor/supervisord.conf && \
    echo 'directory=/app/frontend' >> /etc/supervisor/supervisord.conf && \
    echo 'autostart=true' >> /etc/supervisor/supervisord.conf && \
    echo 'autorestart=true' >> /etc/supervisor/supervisord.conf && \
    echo 'stdout_logfile=/var/log/supervisor/frontend.log' >> /etc/supervisor/supervisord.conf && \
    echo 'stderr_logfile=/var/log/supervisor/frontend-error.log' >> /etc/supervisor/supervisord.conf && \
    echo 'environment=REACT_APP_API_URL="http://localhost:9999"' >> /etc/supervisor/supervisord.conf && \
    echo '' >> /etc/supervisor/supervisord.conf && \
    echo '[program:backend]' >> /etc/supervisor/supervisord.conf && \
    echo 'command=npm start' >> /etc/supervisor/supervisord.conf && \
    echo 'directory=/app/backend' >> /etc/supervisor/supervisord.conf && \
    echo 'autostart=true' >> /etc/supervisor/supervisord.conf && \
    echo 'autorestart=true' >> /etc/supervisor/supervisord.conf && \
    echo 'stdout_logfile=/var/log/supervisor/backend.log' >> /etc/supervisor/supervisord.conf && \
    echo 'stderr_logfile=/var/log/supervisor/backend-error.log' >> /etc/supervisor/supervisord.conf && \
    echo 'environment=PORT="9999",NODE_ENV="development"' >> /etc/supervisor/supervisord.conf && \
    echo '' >> /etc/supervisor/supervisord.conf && \
    echo '[supervisorctl]' >> /etc/supervisor/supervisord.conf && \
    echo 'serverurl=unix:///var/run/supervisor.sock' >> /etc/supervisor/supervisord.conf && \
    echo '' >> /etc/supervisor/supervisord.conf && \
    echo '[unix_http_server]' >> /etc/supervisor/supervisord.conf && \
    echo 'file=/var/run/supervisor.sock' >> /etc/supervisor/supervisord.conf && \
    echo '' >> /etc/supervisor/supervisord.conf && \
    echo '[rpcinterface:supervisor]' >> /etc/supervisor/supervisord.conf && \
    echo 'supervisor.rpcinterface_factory = supervisor.rpcinterface:make_main_rpcinterface' >> /etc/supervisor/supervisord.conf

# Create log directory for supervisor
RUN mkdir -p /var/log/supervisor

# Expose ports
EXPOSE 3000 9999

# Start services using supervisord
CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]
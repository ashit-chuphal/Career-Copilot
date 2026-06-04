# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Setup group and user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Vite app
RUN npm run build

# ---------- PRODUCTION STAGE ----------
FROM nginx:alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config for React Router SPA support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
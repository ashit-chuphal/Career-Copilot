# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

# setup group and user to run the application
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only dependency files first (for caching)
COPY package*.json ./

# Install deps (including dev, needed for build)
RUN npm ci

# Copy rest of the code
COPY . .

# Build Vite app
RUN npm run build

# ---------- PRODUCTION STAGE -----------

FROM nginx:alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from builder stage to nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
# Dockerfile for the backend server of CareerCopilot application

# using official Node.js image as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the port that the server will run on
EXPOSE 5000

# Start the server with database migrations
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
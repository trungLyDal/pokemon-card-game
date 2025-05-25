# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port (must match your app's PORT)
EXPOSE 5000

# Set environment variable (optional, if you want to enforce PORT)
ENV PORT=5000

# Start the server
CMD ["node", "server.js"]

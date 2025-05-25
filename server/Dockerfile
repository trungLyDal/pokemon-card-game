# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the server code
COPY . .

# Expose the port (must match your app's PORT)
EXPOSE 5000

# Set environment variable (optional, if needed)
ENV PORT=5000

# Start the server
CMD ["node", "server.js"]

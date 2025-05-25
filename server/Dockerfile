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

# Expose port (your backend runs on 5000)
EXPOSE 5000

# Start the backend server
CMD ["node", "server.js"]

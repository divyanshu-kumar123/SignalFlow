# Use the official, lightweight Node 20 Alpine image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your backend code
COPY . .

# Expose the port your Express app runs on
EXPOSE 8000

# Start the server
CMD ["npm", "start"]
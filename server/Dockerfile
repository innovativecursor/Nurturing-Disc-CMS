# Server/Dockerfile

# Use an official Node.js image from the Docker Hub
FROM node:20.10.0

# Set the working directory inside the container
WORKDIR /usr/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of your application code to the working directory
COPY . .

# Expose the port that your server will run on
EXPOSE 8080

# Start the server
CMD ["npm", "start"]

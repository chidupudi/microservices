# Use the official Node.js image as a base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of your application code to the container
COPY . .

# Expose the port that the app runs on
EXPOSE 8000

# Start the application
CMD ["npm", "start"]
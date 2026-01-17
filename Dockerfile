FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
# Note: verifying that we install all dependencies including build tools
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 8080

# Start the application
CMD ["npm", "start"]

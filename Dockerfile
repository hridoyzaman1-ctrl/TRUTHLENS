# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# Production Stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
# Only install production dependencies if server.js needs them (express)
RUN npm install --production

# Copy built assets and server script
COPY --from=builder /app/dist ./dist
COPY server.js .

# Expose port
EXPOSE 8080

# Environment variables should be passed at runtime using --env-file or platform config
# CMD ["node", "server.js"]
CMD ["node", "server.js"]

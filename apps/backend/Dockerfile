# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY apps/backend/package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy tsconfig.base.json from root
COPY tsconfig.base.json /tsconfig.base.json

# Copy source
COPY apps/backend/. .

# Generate Prisma Client
RUN npx prisma generate

# Build application
RUN npm run build

# Production stage
FROM node:20-slim

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY apps/backend/package*.json ./

# Install production dependencies only
RUN npm install --only=production --legacy-peer-deps

# Copy built app from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Create data directory
RUN mkdir -p /app/data/database

# Expose port
EXPOSE 3000

# Start app
CMD ["node", "dist/main"]

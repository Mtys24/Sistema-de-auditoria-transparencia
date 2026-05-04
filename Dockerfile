FROM node:20-alpine

WORKDIR /app

# Install dependencies for better-sqlite3 native build
RUN apk add --no-cache python3 make g++

# Copy package files first for layer caching
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Copy app source
COPY server.js ./
COPY db/ ./db/
COPY public/ ./public/
COPY routes/ ./routes/
COPY middleware/ ./middleware/

# Create volume mount point for persistent SQLite data
RUN mkdir -p /app/data

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]

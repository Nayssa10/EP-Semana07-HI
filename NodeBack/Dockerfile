FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use npm ci for reproducible builds)
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Set Node environment to production
ENV NODE_ENV=production

# Run the app
CMD ["node", "index.js"]

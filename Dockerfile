# Use a small Node image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies first (better cache)
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the project
COPY . .

# Build client and move files into server/public (your build.sh already does this)
RUN chmod +x ./build.sh && ./build.sh

# Cloud Run provides PORT; default 8080 if not set
ENV PORT=8080
ENV NODE_ENV=production

# Document the port
EXPOSE 8080

# Start the server via npm "start" script
# 👉 Make sure package.json has: "start": "node server/index.js" (or whatever your server entry is)
CMD ["npm", "start"]

# Use a small, modern Node image
FROM node:20-alpine

# Create and switch to app directory
WORKDIR /usr/src/app

# Install ALL dependencies (including dev deps like vite, esbuild)
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the app (uses your "build" script: vite + esbuild)
RUN npm run build

# Runtime env
ENV NODE_ENV=production
ENV PORT=8080

# Document the port Cloud Run will send traffic to
EXPOSE 8080

# Start the server (uses your "start" script from package.json)
CMD ["npm", "run", "start"]

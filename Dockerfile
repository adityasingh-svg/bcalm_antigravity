FROM node:20-alpine

WORKDIR /usr/src/app

# Install deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy all source code
COPY . .

# 🔁 THIS is the important change:
# ⛔ REMOVE this line:
# RUN chmod +x ./build.sh && ./build.sh
# ✅ REPLACE with:
RUN npm run build

# Cloud Run will inject PORT at runtime
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

# You already changed this in the repo:
# package.json -> "start": "npm run start" (or similar)
CMD ["npm", "run", "start"]


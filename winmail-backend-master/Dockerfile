# Build stage
FROM node:18-alpine as dependencies
WORKDIR /app

# Install build dependencies
COPY package.json .
RUN npm install

# Copy application code
COPY . .

# Final stage
FROM dependencies as builder
RUN npm run build
EXPOSE 5003

CMD ["npm", "run","prod"]

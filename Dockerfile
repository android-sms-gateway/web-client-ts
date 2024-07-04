# Build stage
FROM node:20-alpine as build-stage

WORKDIR /usr/src/app

# Copy TypeScript config
COPY tsconfig.json ./

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install all dependencies and build your app
RUN npm install
COPY src src
RUN npm run build

# Production stage
FROM node:20-alpine as production-stage

WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) for production dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy static files
COPY ./static ./static

# Copy built assets from the build stage
COPY --from=build-stage /usr/src/app/dist ./dist

# Your application binds to port 3000, make sure the container exposes this port
EXPOSE 3000

# The command to run your application
CMD [ "node", "dist/index.js" ]
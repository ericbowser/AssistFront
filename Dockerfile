# syntax=docker/dockerfile:1

# Use the official Node.js image as the base image
ARG NODE_VERSION=22.14.0
FROM node:${NODE_VERSION}-slim AS base

# Set the working directory
WORKDIR /AssistFront

# Copy package.json and package-lock.json for dependency installation
COPY --link package.json package-lock.json ./

# Install dependencies
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy the application source code
COPY --link . .

# Build the application
RUN npm install
RUN npm run tail
RUN npx dotenv-vault@latest pull
RUN npm run build

# Use a minimal Node.js image for the production stage
FROM node:${NODE_VERSION}-slim AS production

# Set the working directory
WORKDIR /AssistFront

# Copy the built application and dependencies from the build stage
COPY --from=base /AssistFront/build ./build
COPY --from=base /AssistFront/node_modules ./node_modules
COPY --from=base /AssistFront/package*.json ./

# Set environment variables
ENV NODE_ENV=production

# Expose the application port
EXPOSE 32635

# Define the command to run the application
CMD ["npm", "run", "webpack"]
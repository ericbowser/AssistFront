
ARG NODE_VERSION=20.17.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR .
COPY . .


# Install dependencies including webpack-cli.
RUN npm ci && npm install -D webpack-cli webpack dotenv
# Copy the production dependencies from the base stage and also

COPY . .
COPY package.json .

# Expose the port that the application listens on.
EXPOSE 32635

RUN npx dotenv-vault@latest pull
# Run the application.
CMD npm run webpack

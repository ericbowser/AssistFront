
ARG NODE_VERSION=20.17.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR ./app
COPY . .


# Install dependencies including webpack-cli.
RUN npm install -D webpack-cli webpack dotenv
# Copy the production dependencies from the base stage and also

CMD ["npm", "run", "build"]

COPY package*.json ./app/
CMD ["npm",  "run", "tail"]

RUN npx dotenv-vault@latest pull
# Expose the port that the application listens on.
EXPOSE 32635
COPY . /app

CMD ["npm", "run", "webpack"]

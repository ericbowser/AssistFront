# Use the official Node image from the Docker Hub.
FROM node:16

# Set the working directory in the container.
WORKDIR ./

# Copy package.json and package-lock.json to the working directory.
COPY package.json .

# Install the dependencies.
RUN npm install

# Copy the rest of the application code to the working directory.
COPY . .

# Expose the port the app runs on.
EXPOSE 32635

# Start the development server.
CMD ["npm", "run", "front"]
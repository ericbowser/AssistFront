
# Use an official Node runtime as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npx tailwindcss build

# Set a default port (can be overridden when running the container)
ENV PORT=32635
ENV NODE_ENV=production
ENV ASSIST_URL=http://localhost:32636/askAssist

# Build the application (including TailwindCSS processing)
RUN npm run build

# Expose the port the app runs on
EXPOSE 32635

# Command to run the application
CMD ["sh", "-c", "npx react-scripts start --port $PORT"]

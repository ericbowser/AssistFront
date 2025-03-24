```markdown
# Running the Project with Docker

## Prerequisites

- Ensure Docker and Docker Compose are installed on your system.
- Verify that the Node.js version specified in the Dockerfile (`NODE_VERSION=22.13.1`) is compatible with your environment.

## Environment Variables

- The project uses environment variables defined in `.env` files. Ensure the required variables are set before running the application.

## Build and Run Instructions

1. Build the Docker images and start the services using Docker Compose:

   ```bash
   docker-compose up --build
   ```

2. Access the application at `http://localhost:32635`.

## Configuration

- The application exposes port `32635` as defined in the Docker Compose file.
- Modify the `compose.yaml` file to adjust configurations as needed.

## Notes

- For development, use the `compose-dev.yaml` file to include additional services or configurations.
- Ensure the `.env` file is properly configured for production or development environments.

For further details, refer to the existing documentation and comments within the configuration files.

# Assist Front
# Assist Back
    [https://github.com/ericbowser/Assist](https://github.com/ericbowser/Assist)

## React.js front-end for LLM support:
    1. OpenAI API
        a. Image generation
        b. Chat model 
        c. Assistant that is connected to vector store and project Id / key
    2. Claude
        a. Basic integration through Anthropic
    3. Gemini
        a. Integrated through Google Cloud project with APIs enabled
    4. Deepseek
        a. Chat and Image generation

## Node.js Back-end:
    [https://github.com/ericbowser/Assist](https://github.com/ericbowser/Assist)

## TODO
    1. Better Image Generation
    2. Embeddings (pretty much done, but am getting postgres hosting figured out with Docker)
    3. File uploads for Assistant vector store
    4. Agents
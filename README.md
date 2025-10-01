# API Project with OpenAPI and Docker

This project implements a RESTful API service with OpenAPI/Swagger specification, including a JavaScript client library and Docker containerization.

## Project Structure

```
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile           # Docker container configuration
├── index.js            # Main API server file
├── swagger.yaml        # OpenAPI/Swagger specification
├── config/             # Configuration files
│   └── logger.js      # Winston logger configuration
├── logs/              # Application logs directory
│   ├── all.log       # Complete application logs
│   └── error.log     # Error-level logs only
├── client-js/         # Generated JavaScript client library
│   ├── src/           # Client source code
│   ├── docs/          # Client documentation
│   └── test/          # Client tests
└── docker/            # Docker related files
    └── datos/         # Data volume
```

## Prerequisites

- Node.js (Latest LTS version recommended)
- Docker
- Docker Compose

## Features

- RESTful API endpoints for blog post management
- OpenAPI/Swagger specification and documentation
- MySQL database for data persistence
- Email notifications via SMTP (MailHog for development)
- Comprehensive logging system with Winston
  - Multiple log levels (error, warn, info, http, debug)
  - Console and file-based logging
  - Separate error log file

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/AlejandroHBerzosa/Practicas-DIGIO.git
   cd Practicas-DIGIO
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application with Docker:
   ```bash
   docker-compose up
   ```

## JavaScript Client Library

The project includes a pre-generated JavaScript client library located in the `client-js` directory. To use the client library:

1. Navigate to the client directory:
   ```bash
   cd client-js
   ```

2. Install client dependencies:
   ```bash
   npm install
   ```

3. Run client tests:
   ```bash
   npm test
   ```

For detailed client documentation, see the `client-js/docs` directory.

## API Documentation

The API is documented using OpenAPI/Swagger specification. You can find the full API documentation:

- In the `swagger.yaml` file
- Through the Swagger UI when running the application (typically at `/docs` endpoint)

## Docker Configuration

The project uses Docker for containerization:

- `Dockerfile`: Defines the container image
- `docker-compose.yml`: Orchestrates the application services
- `docker/datos/`: Contains persistent data volume

## Development

To start development:

1. Make changes to the API specification in `swagger.yaml`
2. Update the server implementation in `index.js`
3. Test changes locally using Docker Compose
4. Run tests to ensure everything works correctly

### Logging

The application uses Winston for logging with different levels:

- `error`: Critical errors and exceptions
- `warn`: Warning messages and non-critical issues
- `info`: General information about application state
- `http`: HTTP request logging
- `debug`: Detailed debugging information

Log files are stored in the `logs` directory:
- `logs/all.log`: Contains all log levels
- `logs/error.log`: Contains only error-level logs

To view logs in real-time:
```bash
# View all logs
docker compose logs -f app

# View only the last 100 lines
docker compose logs --tail 100 -f app
```

## License

[Add your license information here]

## Contributing

[Add contribution guidelines here]
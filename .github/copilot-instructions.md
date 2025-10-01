# AI Agent Instructions for Blog API Project

## Project Overview
This is a RESTful API service for managing blog posts, built with OpenAPI/Swagger and containerized with Docker. The project includes an API server, auto-generated JavaScript client library, and a multi-container Docker environment with MySQL and MailHog for development.

## Key Architecture Components

### API Server (`index.js`)
- Node.js-based REST API server implementing the OpenAPI specification
- Endpoints for CRUD operations on blog posts (`/posts`)
- Error handling follows the schema defined in `swagger.yaml`

### API Client (`client-js/`)
- Auto-generated JavaScript client library using OpenAPI Generator
- Test-driven approach with examples in `client-js/test/`
- Usage examples in `client-js/docs/`

### Docker Environment
- Multi-container setup with app, MySQL, MailHog, and Swagger UI
- Networks: Uses `blog_network` bridge for service communication
- Persistent storage: MySQL data in named volume `mysql_data`

## Development Workflow

### Local Setup
```bash
# Start all services
docker-compose up

# Access components
API Server: http://localhost:4000
Swagger UI: http://localhost:8080
MailHog UI: http://localhost:8025
MySQL: localhost:3307
```

### Environment Configuration
Key environment variables (defined in `docker-compose.yml`):
- Database: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- Email: `SMTP_HOST`, `SMTP_PORT`, `SMTP_FROM`

### Testing & Development
1. Define API changes in `swagger.yaml`
2. Implement changes in `index.js`
3. Run client tests: `cd client-js && npm test`

## Important Patterns

### Error Handling
- All errors follow the schema defined in `components.schemas.Error`
- Standard responses for 400, 404, and 500 errors are defined in `swagger.yaml`
- Example error response:
  ```json
  {
    "error": "Petición inválida",
    "details": "El campo title es requerido"
  }
  ```

### Database Integration
- MySQL 8.0 is used for persistence
- Health checks ensure database availability before app startup
- Configuration via environment variables for flexibility

### API Documentation
- OpenAPI/Swagger spec in `swagger.yaml`
- Live documentation via Swagger UI container
- Generated client documentation in `client-js/docs/`

### Email Handling
- MailHog for local email testing
- SMTP configuration via environment variables
- Web interface for viewing sent emails

## Common Workflows

### Adding New API Endpoints
1. Add path and schema to `swagger.yaml`
2. Implement handler in `index.js`
3. Regenerate client library if needed
4. Add tests in `client-js/test/`

### Troubleshooting
- API logs: `docker-compose logs app`
- Database issues: Check health check status with `docker-compose ps`
- Email issues: Verify in MailHog UI (http://localhost:8025)
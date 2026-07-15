# Docker Setup Guide

This guide explains how to run the youVerify eCommerce microservices using Docker.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Project Structure

```
youVerify-eCommerce/
├── customer-service/
│   ├── Dockerfile
│   └── .dockerignore
├── product-service/
│   ├── Dockerfile
│   └── .dockerignore
├── order-service/
│   ├── Dockerfile
│   └── .dockerignore
├── payment-service/
│   ├── Dockerfile
│   └── .dockerignore
└── docker-compose.yml
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| customer-service | 3001 | Customer management |
| product-service | 3002 | Product catalog |
| order-service | 3003 | Order processing |
| payment-service | 3004 | Payment handling |
| MongoDB | 27017 | Database |
| RabbitMQ | 5672 | Message broker (AMQP) |
| RabbitMQ UI | 15672 | Management interface |

## Quick Start

### 1. Start All Services

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

### 2. Check Service Status

```bash
# View running containers
docker-compose ps

# View logs for all services
docker-compose logs -f

# View logs for a specific service
docker-compose logs -f customer-service
```

### 3. Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (database data will be lost)
docker-compose down -v
```

## Individual Service Commands

### Build a Single Service

```bash
docker-compose build customer-service
```

### Start a Single Service

```bash
docker-compose up customer-service
```

### Restart a Service

```bash
docker-compose restart customer-service
```

### View Service Logs

```bash
docker-compose logs -f customer-service
```

## Health Checks

Each service has a health check endpoint:

- Customer Service: http://localhost:3001/health
- Product Service: http://localhost:3002/health
- Order Service: http://localhost:3003/health
- Payment Service: http://localhost:3004/health

## RabbitMQ Management

Access the RabbitMQ Management UI:
- URL: http://localhost:15672
- Username: `guest`
- Password: `guest`

## MongoDB Connection

The MongoDB instance is accessible at:
- Connection String: `mongodb://admin:password123@localhost:27017`
- Username: `admin`
- Password: `password123`

Each service uses a separate database:
- `youverify-customers`
- `youverify-products`
- `youverify-orders`
- `youverify-payments`

## Development Mode

For development with hot reload, you can override the docker-compose.yml:

```bash
# Run services locally instead
cd customer-service
npm run dev
```

## Troubleshooting

### Port Already in Use

If you get a port conflict error:

```bash
# Check what's using the port
lsof -i :3001

# Stop the conflicting process or change the port in docker-compose.yml
```

### Container Won't Start

```bash
# View container logs
docker-compose logs customer-service

# Rebuild without cache
docker-compose build --no-cache customer-service
```

### Clean Slate

```bash
# Stop all containers and remove volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Rebuild everything
docker-compose up --build
```

## Environment Variables

The docker-compose.yml contains default environment variables. For production:

1. Create a `.env` file in the root directory
2. Override the default values:

```env
MONGODB_USERNAME=your_username
MONGODB_PASSWORD=your_password
RABBITMQ_USER=your_user
RABBITMQ_PASS=your_password
```

## Production Deployment

For production, consider:

1. Use environment-specific configuration files
2. Enable SSL/TLS for MongoDB and RabbitMQ
3. Use secrets management (Docker Secrets, AWS Secrets Manager, etc.)
4. Set up monitoring and logging
5. Configure reverse proxy (nginx/traefik)
6. Use Docker Swarm or Kubernetes for orchestration

## Network

All services communicate through the `microservices-network` bridge network:
- Services can reach each other using service names
- Example: `http://customer-service:3001`

## Volumes

Persistent data is stored in named volumes:
- `mongodb_data` - MongoDB database files
- `rabbitmq_data` - RabbitMQ message queues

To backup volumes:

```bash
docker run --rm -v mongodb_data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb-backup.tar.gz /data
```

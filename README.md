# youVerify eCommerce - Microservices Platform

A modern, scalable e-commerce platform built with microservices architecture, featuring customer management, product catalog, order processing, and payment handling.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Services](#services)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Running with Docker](#running-with-docker)
- [Running Locally](#running-locally)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

## 🏗️ Architecture Overview

The platform follows a microservices architecture pattern with the following components:

```
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway / Client                    │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Customer   │     │   Product    │     │    Order     │
│   Service    │     │   Service    │     │   Service    │
│   :3001      │     │   :3002      │     │   :3003      │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                     │
       │                    │                     │
       └────────────────────┼─────────────────────┘
                            │
                    ┌───────▼────────┐
                    │    MongoDB     │
                    │    :27017      │
                    └────────────────┘

                    ┌──────────────┐
                    │   Payment    │
                    │   Service    │◄──────┐
                    │   :3004      │       │
                    └──────┬───────┘       │
                           │               │
                    ┌──────▼────────┐      │
                    │   RabbitMQ    │──────┘
                    │   :5672       │
                    └───────────────┘
```

## 🔧 Services

### Customer Service (Port 3001)
Manages customer data and authentication.

**Features:**
- Create, read, update customers
- Email validation and uniqueness
- Customer data management

**Endpoints:**
- `GET /customers` - List all customers
- `GET /customers/:id` - Get customer by ID
- `POST /customers` - Create new customer

### Product Service (Port 3002)
Handles product catalog and inventory.

**Features:**
- Product CRUD operations
- Stock quantity management
- Product search and listing

**Endpoints:**
- `GET /products` - List all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Order Service (Port 3003)
Processes customer orders and coordinates with other services.

**Features:**
- Order creation and validation
- Customer and product verification
- Payment initiation
- Order status tracking

**Endpoints:**
- `POST /orders` - Create new order

### Payment Service (Port 3004)
Handles payment processing and transaction management.

**Features:**
- Payment processing
- Transaction ID generation
- RabbitMQ message publishing
- Payment status tracking

**Endpoints:**
- `POST /payments` - Process payment

## 🛠️ Tech Stack

**Backend:**
- Node.js 22
- Express.js 5.x
- MongoDB 7.0
- Mongoose 9.x
- RabbitMQ 3.12

**Validation & Security:**
- Joi - Schema validation
- Helmet - Security headers
- CORS - Cross-origin resource sharing
- Morgan - HTTP request logger

**Testing:**
- Jest 29.x
- Supertest 7.x
- 90%+ code coverage

**DevOps:**
- Docker & Docker Compose
- Multi-stage Dockerfiles
- Health checks
- Alpine Linux base images

## 🚀 Getting Started

### Prerequisites

- Node.js 22.x or higher
- MongoDB 7.0 or higher
- RabbitMQ 3.12 or higher (for payment service)
- Docker & Docker Compose (for containerized deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd youVerify-eCommerce
   ```

2. **Install dependencies for each service**
   ```bash
   # Customer Service
   cd customer-service && npm install && cd ..

   # Product Service
   cd product-service && npm install && cd ..

   # Order Service
   cd order-service && npm install && cd ..

   # Payment Service
   cd payment-service && npm install && cd ..
   ```

## 🐳 Running with Docker

The easiest way to run the entire platform is using Docker Compose.

### Quick Start

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (deletes data)
docker-compose down -v
```

### Individual Service Management

```bash
# Start specific service
docker-compose up customer-service

# Rebuild and start
docker-compose up --build customer-service

# View service logs
docker-compose logs -f order-service
```

### Access Points

Once running, services are available at:

- **Customer Service:** http://localhost:3001
- **Product Service:** http://localhost:3002
- **Order Service:** http://localhost:3003
- **Payment Service:** http://localhost:3004
- **RabbitMQ Management UI:** http://localhost:15672 (guest/guest)
- **MongoDB:** mongodb://admin:password123@localhost:27017

## 💻 Running Locally

### 1. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  mongo:7.0

# Or use local MongoDB installation
mongod --dbpath /path/to/data
```

### 2. Start RabbitMQ (for payment service)

```bash
# Using Docker
docker run -d -p 5672:5672 -p 15672:15672 \
  rabbitmq:3.12-management-alpine
```

### 3. Configure Environment Variables

Create `.env` file in each service directory:

**customer-service/.env**
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=mongodb://admin:password123@localhost:27017/youverify-customers?authSource=admin
```

**product-service/.env**
```env
NODE_ENV=development
PORT=3002
DATABASE_URL=mongodb://admin:password123@localhost:27017/youverify-products?authSource=admin
```

**order-service/.env**
```env
NODE_ENV=development
PORT=3003
DATABASE_URL=mongodb://admin:password123@localhost:27017/youverify-orders?authSource=admin
CUSTOMER_SERVICE_URL=http://localhost:3001
PRODUCT_SERVICE_URL=http://localhost:3002
PAYMENT_SERVICE_URL=http://localhost:3004
```

**payment-service/.env**
```env
NODE_ENV=development
PORT=3004
DATABASE_URL=mongodb://admin:password123@localhost:27017/youverify-payments?authSource=admin
RABBITMQ_URL=amqp://localhost:5672
QUEUE_NAME=payment_queue
```

### 4. Start Services

Open separate terminals for each service:

```bash
# Terminal 1 - Customer Service
cd customer-service
npm run dev

# Terminal 2 - Product Service
cd product-service
npm run dev

# Terminal 3 - Order Service
cd order-service
npm run dev

# Terminal 4 - Payment Service
cd payment-service
npm run dev
```

## 📚 API Documentation

### Order Creation Request

**Endpoint:** `POST /api/orders`

**Request Body:**
```json
{
  "customerId": "507f1f77bcf86cd799439011",
  "productId": "507f191e810c19729de860ea",
  "amount": 99.99
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "customerId": "507f1f77bcf86cd799439011",
    "orderId": "507f1f77bcf86cd799439013",
    "productId": "507f191e810c19729de860ea",
    "orderStatus": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Payment Processing

**Endpoint:** `POST /api/payments`

**Request Body:**
```json
{
  "customerId": "507f1f77bcf86cd799439011",
  "orderId": "507f1f77bcf86cd799439013",
  "amount": 99.99
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "transactionId": "TXN-1234567890-abc123",
    "orderId": "507f1f77bcf86cd799439013",
    "customerId": "507f1f77bcf86cd799439011",
    "amount": 99.99,
    "paymentStatus": "success",
    "timestamp": "2024-01-15T10:30:01.000Z"
  }
}
```

## 🧪 Testing

Each service has comprehensive integration tests using Jest and Supertest.

### Run All Tests

```bash
# Customer Service
cd customer-service
npm test

# Product Service
cd product-service
npm test

# Order Service
cd order-service
npm test

# Payment Service
cd payment-service
npm test
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Test Coverage

- Customer Service: 14 test cases
- Product Service: 21 test cases
- Order Service: 10 test cases
- Payment Service: 9 test cases

**Total: 54 test cases** with 90%+ code coverage

## 📁 Project Structure

```
youVerify-eCommerce/
├── customer-service/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Error handling, async wrapper
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Custom errors, response formatter
│   │   ├── validations/    # Joi validation schemas
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Server entry point
│   ├── __tests__/          # Integration tests
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── jest.config.js
│   └── package.json
│
├── product-service/        # Same structure as customer-service
├── order-service/          # Same structure as customer-service
├── payment-service/        # Same structure + RabbitMQ config
├── docker-compose.yml      # Orchestration file
├── DOCKER.md              # Docker documentation
└── README.md              # This file
```

## 🔐 Environment Variables

### Common Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Service port | Service-specific |
| `DATABASE_URL` | MongoDB connection string | - |

### Service-Specific Variables

#### Order Service
| Variable | Description | Required |
|----------|-------------|----------|
| `CUSTOMER_SERVICE_URL` | Customer service endpoint | Yes |
| `PRODUCT_SERVICE_URL` | Product service endpoint | Yes |
| `PAYMENT_SERVICE_URL` | Payment service endpoint | Yes |

#### Payment Service
| Variable | Description | Required |
|----------|-------------|----------|
| `RABBITMQ_URL` | RabbitMQ connection string | Yes |
| `QUEUE_NAME` | RabbitMQ queue name | Yes |

## 🔒 Security Features

- **Helmet.js** - Sets security HTTP headers
- **CORS** - Configured cross-origin resource sharing
- **Input Validation** - Joi schema validation on all endpoints
- **Error Handling** - Custom error classes with proper status codes
- **MongoDB Injection Prevention** - Mongoose built-in protection
- **Rate Limiting** - Ready for implementation

## 🎯 Best Practices Implemented

1. **Separation of Concerns** - Controller → Service → Model pattern
2. **Error Handling** - Centralized error middleware
3. **Validation** - Joi schema validation before business logic
4. **Response Formatting** - Consistent API responses
5. **Testing** - Comprehensive integration tests with mocks
6. **Docker** - Multi-stage builds, health checks, non-root users
7. **Documentation** - Code comments and API documentation
8. **Logging** - Morgan HTTP request logging

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Write tests for all new features
- Follow existing code style and patterns
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Keep commits atomic and well-described

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Opeyemi Bantale

## 🙏 Acknowledgments

- Built with Node.js and Express
- MongoDB for database
- RabbitMQ for message queuing
- Docker for containerization
- Jest for testing

---

**Happy Coding! 🚀**

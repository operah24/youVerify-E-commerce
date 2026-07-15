const request = require('supertest');
const app = require('../src/app');
const Customer = require('../src/models/customer.model');

// Mock Customer model
jest.mock('../src/models/customer.model');

describe('Customer Service Integration Tests', () => {

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('GET /customers', () => {

    it('should return all customers', async () => {
      const mockCustomers = [
        {
          _id: '507f1f77bcf86cd799439011',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          createdAt: new Date()
        },
        {
          _id: '507f1f77bcf86cd799439012',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+0987654321',
          createdAt: new Date()
        }
      ];

      // Mock Customer.find().sort()
      Customer.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockCustomers)
      });

      const response = await request(app)
        .get('/customers')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Customers retrieved successfully');
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty('name', 'John Doe');
      expect(Customer.find).toHaveBeenCalled();
    });

    it('should return empty array when no customers exist', async () => {
      Customer.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([])
      });

      const response = await request(app)
        .get('/customers')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });

  });

  describe('GET /customers/:id', () => {

    it('should return a customer by valid ID', async () => {
      const mockCustomer = {
        _id: '507f1f77bcf86cd799439011',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        createdAt: new Date()
      };

      Customer.findById = jest.fn().mockResolvedValue(mockCustomer);

      const response = await request(app)
        .get('/customers/507f1f77bcf86cd799439011')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Customer retrieved successfully');
      expect(response.body.data).toHaveProperty('name', 'John Doe');
      expect(response.body.data).toHaveProperty('email', 'john@example.com');
      expect(Customer.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/customers/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid customer ID format');
    });

    it('should return 404 when customer not found', async () => {
      Customer.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .get('/customers/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Customer not found');
      expect(Customer.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

  });

  describe('POST /customers', () => {

    it('should create a customer with valid data', async () => {
      const customerData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      };

      const mockCreatedCustomer = {
        _id: '507f1f77bcf86cd799439011',
        ...customerData,
        createdAt: new Date()
      };

      // Mock findOne to return null (email doesn't exist)
      Customer.findOne = jest.fn().mockResolvedValue(null);
      // Mock create
      Customer.create = jest.fn().mockResolvedValue(mockCreatedCustomer);

      const response = await request(app)
        .post('/customers')
        .send(customerData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Customer created successfully');
      expect(response.body.data).toHaveProperty('name', 'John Doe');
      expect(response.body.data).toHaveProperty('email', 'john@example.com');
      expect(Customer.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
      expect(Customer.create).toHaveBeenCalled();
    });

    it('should return 400 for missing name', async () => {
      const invalidData = {
        email: 'john@example.com',
        phone: '+1234567890'
      };

      const response = await request(app)
        .post('/customers')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Customer name is required');
    });

    it('should return 400 for missing email', async () => {
      const invalidData = {
        name: 'John Doe',
        phone: '+1234567890'
      };

      const response = await request(app)
        .post('/customers')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Email is required');
    });

    it('should return 400 for missing phone', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      const response = await request(app)
        .post('/customers')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Phone number is required');
    });

    it('should return 400 for invalid email format', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        phone: '+1234567890'
      };

      const response = await request(app)
        .post('/customers')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('valid email');
    });

    it('should return 400 for name too short', async () => {
      const invalidData = {
        name: 'J',
        email: 'john@example.com',
        phone: '+1234567890'
      };

      const response = await request(app)
        .post('/customers')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('at least 2 characters');
    });

    it('should return 400 for invalid phone format', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: 'abc'
      };

      const response = await request(app)
        .post('/customers')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('valid phone number');
    });

    it('should return 409 for duplicate email', async () => {
      const customerData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      };

      const existingCustomer = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Existing User',
        email: 'john@example.com',
        phone: '+9999999999'
      };

      // Mock findOne to return existing customer
      Customer.findOne = jest.fn().mockResolvedValue(existingCustomer);

      const response = await request(app)
        .post('/customers')
        .send(customerData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email already exists');
      expect(Customer.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
    });

  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('service', 'Customer Service');
      expect(response.body).toHaveProperty('status', 'UP');
    });
  });

});

const request = require('supertest');
const app = require('../src/app');
const customerClient = require('../src/client/customer.client');
const productClient = require('../src/client/product.client');
const paymentClient = require('../src/client/payment.client');
const Order = require('../src/models/order.model');

// Mock all external dependencies
jest.mock('../src/client/customer.client');
jest.mock('../src/client/product.client');
jest.mock('../src/client/payment.client');
jest.mock('../src/models/order.model');

describe('Order Service Integration Tests', () => {

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('POST /orders', () => {

    it('should create an order successfully with valid data', async () => {
      // Mock data
      const orderData = {
        customerId: '507f1f77bcf86cd799439011',
        productId: '507f191e810c19729de860ea',
        amount: 100
      };

      const mockCustomer = {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          name: 'John Doe',
          email: 'john@example.com'
        }
      };

      const mockProduct = {
        success: true,
        data: {
          _id: '507f191e810c19729de860ea',
          name: 'Test Product',
          price: 100
        }
      };

      const mockOrder = {
        _id: '507f1f77bcf86cd799439012',
        customerId: orderData.customerId,
        productId: orderData.productId,
        amount: orderData.amount,
        orderStatus: 'PENDING'
      };

      // Setup mocks
      customerClient.findCustomer.mockResolvedValue(mockCustomer);
      productClient.findProduct.mockResolvedValue(mockProduct);
      paymentClient.makePayment.mockResolvedValue({ success: true });
      Order.create.mockResolvedValue(mockOrder);

      // Make request
      const response = await request(app)
        .post('/orders')
        .send(orderData)
        .expect(201);

      // Assertions
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Order created successfully');
      expect(response.body.data).toHaveProperty('customerId', orderData.customerId);
      expect(response.body.data).toHaveProperty('productId', orderData.productId);
      expect(response.body.data).toHaveProperty('orderId');
      expect(response.body.data).toHaveProperty('orderStatus', 'PENDING');

      // Verify mocks were called
      expect(customerClient.findCustomer).toHaveBeenCalledWith(orderData.customerId);
      expect(productClient.findProduct).toHaveBeenCalledWith(orderData.productId);
      expect(Order.create).toHaveBeenCalled();
      expect(paymentClient.makePayment).toHaveBeenCalled();
    });

    it('should return 400 for missing customerId', async () => {
      const invalidData = {
        productId: '507f191e810c19729de860ea',
        amount: 100
      };

      const response = await request(app)
        .post('/orders')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Customer ID is required');
    });

    it('should return 400 for missing productId', async () => {
      const invalidData = {
        customerId: '507f1f77bcf86cd799439011',
        amount: 100
      };

      const response = await request(app)
        .post('/orders')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Product ID is required');
    });

    it('should return 400 for missing amount', async () => {
      const invalidData = {
        customerId: '507f1f77bcf86cd799439011',
        productId: '507f191e810c19729de860ea'
      };

      const response = await request(app)
        .post('/orders')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Amount is required');
    });

    it('should return 400 for invalid customerId format', async () => {
      const invalidData = {
        customerId: 'invalid-id',
        productId: '507f191e810c19729de860ea',
        amount: 100
      };

      const response = await request(app)
        .post('/orders')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid customer ID format');
    });

    it('should return 400 for invalid productId format', async () => {
      const invalidData = {
        customerId: '507f1f77bcf86cd799439011',
        productId: 'invalid-id',
        amount: 100
      };

      const response = await request(app)
        .post('/orders')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid product ID format');
    });

    it('should return 400 for negative amount', async () => {
      const invalidData = {
        customerId: '507f1f77bcf86cd799439011',
        productId: '507f191e810c19729de860ea',
        amount: -10
      };

      const response = await request(app)
        .post('/orders')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Amount must be a positive number');
    });

    it('should return 404 when customer not found', async () => {
      const orderData = {
        customerId: '507f1f77bcf86cd799439011',
        productId: '507f191e810c19729de860ea',
        amount: 100
      };

      // Mock customer not found
      customerClient.findCustomer.mockResolvedValue(null);

      const response = await request(app)
        .post('/orders')
        .send(orderData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Customer not found');
      expect(customerClient.findCustomer).toHaveBeenCalledWith(orderData.customerId);
    });

    it('should return 404 when product not found', async () => {
      const orderData = {
        customerId: '507f1f77bcf86cd799439011',
        productId: '507f191e810c19729de860ea',
        amount: 100
      };

      const mockCustomer = {
        success: true,
        data: { _id: orderData.customerId, name: 'John Doe' }
      };

      // Mock customer found but product not found
      customerClient.findCustomer.mockResolvedValue(mockCustomer);
      productClient.findProduct.mockResolvedValue(null);

      const response = await request(app)
        .post('/orders')
        .send(orderData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Product not found');
      expect(customerClient.findCustomer).toHaveBeenCalledWith(orderData.customerId);
      expect(productClient.findProduct).toHaveBeenCalledWith(orderData.productId);
    });

  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('service', 'Order Service');
      expect(response.body).toHaveProperty('status', 'UP');
    });
  });

});

const request = require('supertest');
const app = require('../src/app');
const rabbit = require('../src/config/rabbitmq');

// Mock RabbitMQ
jest.mock('../src/config/rabbitmq');

describe('Payment Service Integration Tests', () => {

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('POST /payments', () => {

    it('should process payment successfully with valid data', async () => {
      const paymentData = {
        customerId: '507f1f77bcf86cd799439011',
        orderId: '507f1f77bcf86cd799439012',
        productId: '507f191e810c19729de860ea',
        amount: 100
      };

      // Mock RabbitMQ publish
      rabbit.publish = jest.fn().mockResolvedValue(true);

      const response = await request(app)
        .post('/payments')
        .send(paymentData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Payment processed successfully');
      expect(response.body.data).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('message', 'Payment Successful');

      // Verify RabbitMQ publish was called
      expect(rabbit.publish).toHaveBeenCalledTimes(1);
      expect(rabbit.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          customerId: paymentData.customerId,
          orderId: paymentData.orderId,
          productId: paymentData.productId,
          amount: paymentData.amount,
          paymentStatus: 'success',
          transactionId: expect.stringMatching(/^TXN-/)
        })
      );
    });

    it('should process payment without productId', async () => {
      const paymentData = {
        customerId: '507f1f77bcf86cd799439011',
        orderId: '507f1f77bcf86cd799439012',
        amount: 100
      };

      rabbit.publish = jest.fn().mockResolvedValue(true);

      const response = await request(app)
        .post('/payments')
        .send(paymentData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(rabbit.publish).toHaveBeenCalled();
    });

    it('should return 400 for missing customerId', async () => {
      const invalidData = {
        orderId: '507f1f77bcf86cd799439012',
        amount: 100
      };

      const response = await request(app)
        .post('/payments')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Missing required fields');
      expect(rabbit.publish).not.toHaveBeenCalled();
    });

    it('should return 400 for missing orderId', async () => {
      const invalidData = {
        customerId: '507f1f77bcf86cd799439011',
        amount: 100
      };

      const response = await request(app)
        .post('/payments')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Missing required fields');
      expect(rabbit.publish).not.toHaveBeenCalled();
    });

    it('should return 400 for missing amount', async () => {
      const invalidData = {
        customerId: '507f1f77bcf86cd799439011',
        orderId: '507f1f77bcf86cd799439012'
      };

      const response = await request(app)
        .post('/payments')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Missing required fields');
      expect(rabbit.publish).not.toHaveBeenCalled();
    });

    it('should return 400 for zero amount', async () => {
      const invalidData = {
        customerId: '507f1f77bcf86cd799439011',
        orderId: '507f1f77bcf86cd799439012',
        amount: 0
      };

      const response = await request(app)
        .post('/payments')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Amount must be greater than zero');
      expect(rabbit.publish).not.toHaveBeenCalled();
    });

    it('should return 400 for negative amount', async () => {
      const invalidData = {
        customerId: '507f1f77bcf86cd799439011',
        orderId: '507f1f77bcf86cd799439012',
        amount: -50
      };

      const response = await request(app)
        .post('/payments')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Amount must be greater than zero');
      expect(rabbit.publish).not.toHaveBeenCalled();
    });

    it('should generate unique transaction IDs for multiple payments', async () => {
      const paymentData = {
        customerId: '507f1f77bcf86cd799439011',
        orderId: '507f1f77bcf86cd799439012',
        amount: 100
      };

      rabbit.publish = jest.fn().mockResolvedValue(true);

      // Make first payment
      await request(app)
        .post('/payments')
        .send(paymentData)
        .expect(201);

      const firstCall = rabbit.publish.mock.calls[0][0];

      // Make second payment
      await request(app)
        .post('/payments')
        .send(paymentData)
        .expect(201);

      const secondCall = rabbit.publish.mock.calls[1][0];

      // Transaction IDs should be different
      expect(firstCall.transactionId).not.toBe(secondCall.transactionId);
      expect(firstCall.transactionId).toMatch(/^TXN-/);
      expect(secondCall.transactionId).toMatch(/^TXN-/);
    });

  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('service', 'Payment Service');
      expect(response.body).toHaveProperty('status', 'UP');
    });
  });

});

const request = require('supertest');
const app = require('../src/app');
const Product = require('../src/models/product.model');

// Mock Product model
jest.mock('../src/models/product.model');

describe('Product Service Integration Tests', () => {

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('GET /products', () => {

    it('should return all products', async () => {
      const mockProducts = [
        {
          _id: '507f191e810c19729de860ea',
          name: 'Laptop',
          description: 'Gaming laptop',
          price: 1200,
          stockQuantity: 10,
          createdAt: new Date()
        },
        {
          _id: '507f191e810c19729de860eb',
          name: 'Mouse',
          description: 'Wireless mouse',
          price: 25,
          stockQuantity: 50,
          createdAt: new Date()
        }
      ];

      Product.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockProducts)
      });

      const response = await request(app)
        .get('/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Products retrieved successfully');
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty('name', 'Laptop');
      expect(Product.find).toHaveBeenCalled();
    });

    it('should return empty array when no products exist', async () => {
      Product.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([])
      });

      const response = await request(app)
        .get('/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });

  });

  describe('GET /products/:id', () => {

    it('should return a product by valid ID', async () => {
      const mockProduct = {
        _id: '507f191e810c19729de860ea',
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1200,
        stockQuantity: 10,
        createdAt: new Date()
      };

      Product.findById = jest.fn().mockResolvedValue(mockProduct);

      const response = await request(app)
        .get('/products/507f191e810c19729de860ea')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Product retrieved successfully');
      expect(response.body.data).toHaveProperty('name', 'Laptop');
      expect(response.body.data).toHaveProperty('price', 1200);
      expect(Product.findById).toHaveBeenCalledWith('507f191e810c19729de860ea');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/products/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid product ID format');
    });

    it('should return 404 when product not found', async () => {
      Product.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .get('/products/507f191e810c19729de860ea')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Product not found');
      expect(Product.findById).toHaveBeenCalledWith('507f191e810c19729de860ea');
    });

  });

  describe('POST /products', () => {

    it('should create a product with valid data', async () => {
      const productData = {
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1200,
        stockQuantity: 10
      };

      const mockCreatedProduct = {
        _id: '507f191e810c19729de860ea',
        ...productData,
        createdAt: new Date()
      };

      Product.create = jest.fn().mockResolvedValue(mockCreatedProduct);

      const response = await request(app)
        .post('/products')
        .send(productData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Product created successfully');
      expect(response.body.data).toHaveProperty('name', 'Laptop');
      expect(response.body.data).toHaveProperty('price', 1200);
      expect(Product.create).toHaveBeenCalled();
    });

    it('should create a product without optional description', async () => {
      const productData = {
        name: 'Mouse',
        price: 25,
        stockQuantity: 50
      };

      const mockCreatedProduct = {
        _id: '507f191e810c19729de860ea',
        ...productData,
        createdAt: new Date()
      };

      Product.create = jest.fn().mockResolvedValue(mockCreatedProduct);

      const response = await request(app)
        .post('/products')
        .send(productData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(Product.create).toHaveBeenCalled();
    });

    it('should return 400 for missing name', async () => {
      const invalidData = {
        price: 1200,
        stockQuantity: 10
      };

      const response = await request(app)
        .post('/products')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Product name is required');
    });

    it('should return 400 for missing price', async () => {
      const invalidData = {
        name: 'Laptop',
        stockQuantity: 10
      };

      const response = await request(app)
        .post('/products')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Price is required');
    });

    it('should return 400 for missing stockQuantity', async () => {
      const invalidData = {
        name: 'Laptop',
        price: 1200
      };

      const response = await request(app)
        .post('/products')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Stock quantity is required');
    });

    it('should return 400 for negative price', async () => {
      const invalidData = {
        name: 'Laptop',
        price: -100,
        stockQuantity: 10
      };

      const response = await request(app)
        .post('/products')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Price must be a positive number');
    });

    it('should return 400 for negative stockQuantity', async () => {
      const invalidData = {
        name: 'Laptop',
        price: 1200,
        stockQuantity: -5
      };

      const response = await request(app)
        .post('/products')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Stock quantity cannot be negative');
    });

    it('should return 400 for name too short', async () => {
      const invalidData = {
        name: 'L',
        price: 1200,
        stockQuantity: 10
      };

      const response = await request(app)
        .post('/products')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('at least 2 characters');
    });

  });

  describe('PUT /products/:id', () => {

    it('should update a product with valid data', async () => {
      const updateData = {
        name: 'Updated Laptop',
        price: 1500
      };

      const mockExistingProduct = {
        _id: '507f191e810c19729de860ea',
        name: 'Laptop',
        price: 1200,
        stockQuantity: 10
      };

      const mockUpdatedProduct = {
        _id: '507f191e810c19729de860ea',
        name: 'Updated Laptop',
        price: 1500,
        stockQuantity: 10
      };

      Product.findById = jest.fn().mockResolvedValue(mockExistingProduct);
      Product.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedProduct);

      const response = await request(app)
        .put('/products/507f191e810c19729de860ea')
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Product updated successfully');
      expect(response.body.data).toHaveProperty('name', 'Updated Laptop');
      expect(response.body.data).toHaveProperty('price', 1500);
      expect(Product.findById).toHaveBeenCalledWith('507f191e810c19729de860ea');
      expect(Product.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should return 400 for invalid product ID', async () => {
      const updateData = {
        name: 'Updated Laptop'
      };

      const response = await request(app)
        .put('/products/invalid-id')
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid product ID format');
    });

    it('should return 404 when product not found', async () => {
      const updateData = {
        name: 'Updated Laptop'
      };

      Product.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .put('/products/507f191e810c19729de860ea')
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Product not found');
    });

    it('should return 400 for empty update data', async () => {
      const response = await request(app)
        .put('/products/507f191e810c19729de860ea')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('At least one field is required for update');
    });

  });

  describe('DELETE /products/:id', () => {

    it('should delete a product successfully', async () => {
      const mockProduct = {
        _id: '507f191e810c19729de860ea',
        name: 'Laptop',
        price: 1200,
        stockQuantity: 10
      };

      Product.findById = jest.fn().mockResolvedValue(mockProduct);
      Product.findByIdAndDelete = jest.fn().mockResolvedValue(mockProduct);

      const response = await request(app)
        .delete('/products/507f191e810c19729de860ea')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Product deleted successfully');
      expect(response.body.data).toHaveProperty('name', 'Laptop');
      expect(Product.findById).toHaveBeenCalledWith('507f191e810c19729de860ea');
      expect(Product.findByIdAndDelete).toHaveBeenCalledWith('507f191e810c19729de860ea');
    });

    it('should return 400 for invalid product ID', async () => {
      const response = await request(app)
        .delete('/products/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid product ID format');
    });

    it('should return 404 when product not found', async () => {
      Product.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .delete('/products/507f191e810c19729de860ea')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Product not found');
    });

  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('service', 'Product Service');
      expect(response.body).toHaveProperty('status', 'UP');
    });
  });

});

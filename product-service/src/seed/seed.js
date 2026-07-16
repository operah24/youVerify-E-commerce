require('dotenv').config();

const { connectDB } = require('../config/database');
const Product = require('../models/product.model');

const seedProducts = async () => {
  try {
    await connectDB('product_db');

    await Product.deleteMany({});

    const products = await Product.insertMany([
      {
        name: 'Laptop Computer',
        description: 'High-performance laptop with 16GB RAM and 512GB SSD',
        price: 1299.99,
        stockQuantity: 50
      },
      {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with adjustable DPI',
        price: 29.99,
        stockQuantity: 200
      },
      {
        name: 'Mechanical Keyboard',
        description: 'RGB mechanical keyboard with blue switches',
        price: 89.99,
        stockQuantity: 100
      }
    ]);

    console.log('✓ Products seeded successfully');
    console.log(`Created ${products.length} products:`);
    products.forEach(product => {
      console.log(`  - ${product.name} ($${product.price}) (ID: ${product._id})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();

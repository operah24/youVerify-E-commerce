
require('dotenv').config();
const { connectDB } = require('../config/database');
const Customer = require('../models/customer.model');

const seedCustomers = async () => {
  try {
    await connectDB();

    await Customer.deleteMany({});

    const customers = await Customer.insertMany([
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890'
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1987654321',
      }
    ]);

    console.log('Customers seeded successfully');
    console.log(`Created ${customers.length} customers:`);
    customers.forEach(customer => {
      console.log(`  - ${customer.name} (ID: ${customer._id})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding customers:', error);
    process.exit(1);
  }
};

seedCustomers();
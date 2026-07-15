const Customer = require("../models/customer.model");
const {
  createCustomerSchema,
  updateCustomerSchema,
  getCustomerSchema
} = require('../validations/customer.validation');
const {
  ValidationError,
  NotFoundError,
  ConflictError
} = require('../utils/customError');

exports.getAllCustomers = async () => {
  const customers = await Customer.find().sort({ createdAt: -1 });
  return customers;
};

exports.getCustomerById = async (id) => {
  // Validate ID
  const { error } = getCustomerSchema.validate({ id });
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const customer = await Customer.findById(id);
  if (!customer) {
    throw new NotFoundError('Customer not found');
  }

  return customer;
};

exports.createCustomer = async (data) => {
  // Validate input data
  const { error, value } = createCustomerSchema.validate(data);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  // Check if email already exists
  const existingCustomer = await Customer.findOne({ email: value.email });
  if (existingCustomer) {
    throw new ConflictError('Email already exists');
  }

  // Create customer
  const customer = await Customer.create(value);
  return customer;
};

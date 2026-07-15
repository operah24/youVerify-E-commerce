const Product = require("../models/product.model");
const {
  createProductSchema,
  updateProductSchema,
  getProductSchema
} = require('../validations/product.validation');
const {
  ValidationError,
  NotFoundError
} = require('../utils/customError');

exports.getAllProducts = async () => {
  const products = await Product.find().sort({ createdAt: -1 });
  return products;
};

exports.getProductById = async (id) => {
  // Validate ID
  const { error } = getProductSchema.validate({ id });
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new NotFoundError('Product not found');
  }

  return product;
};

exports.createProduct = async (data) => {
  // Validate input data
  const { error, value } = createProductSchema.validate(data);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  // Create product
  const product = await Product.create(value);
  return product;
};

exports.updateProduct = async (id, data) => {
  // Validate ID
  const { error: idError } = getProductSchema.validate({ id });
  if (idError) {
    throw new ValidationError(idError.details[0].message);
  }

  // Validate update data
  const { error: dataError, value } = updateProductSchema.validate(data);
  if (dataError) {
    throw new ValidationError(dataError.details[0].message);
  }

  // Check if product exists
  const product = await Product.findById(id);
  if (!product) {
    throw new NotFoundError('Product not found');
  }

  // Update product
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    value,
    { new: true, runValidators: true }
  );

  return updatedProduct;
};

exports.deleteProduct = async (id) => {
  // Validate ID
  const { error } = getProductSchema.validate({ id });
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new NotFoundError('Product not found');
  }

  await Product.findByIdAndDelete(id);
  return product;
};

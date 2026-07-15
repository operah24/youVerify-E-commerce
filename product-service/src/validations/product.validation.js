const Joi = require('joi');

const createProductSchema = Joi.object({
  name: Joi.string()
    .trim()
    .required()
    .min(2)
    .max(200)
    .messages({
      'string.empty': 'Product name is required',
      'string.min': 'Product name must be at least 2 characters',
      'string.max': 'Product name cannot exceed 200 characters',
      'any.required': 'Product name is required'
    }),

  description: Joi.string()
    .trim()
    .allow('', null)
    .max(1000)
    .messages({
      'string.max': 'Description cannot exceed 1000 characters'
    }),

  price: Joi.number()
    .required()
    .min(0)
    .messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price must be a positive number',
      'any.required': 'Price is required'
    }),

  stockQuantity: Joi.number()
    .required()
    .integer()
    .min(0)
    .messages({
      'number.base': 'Stock quantity must be a number',
      'number.integer': 'Stock quantity must be an integer',
      'number.min': 'Stock quantity cannot be negative',
      'any.required': 'Stock quantity is required'
    })
});

const updateProductSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(200)
    .messages({
      'string.min': 'Product name must be at least 2 characters',
      'string.max': 'Product name cannot exceed 200 characters'
    }),

  description: Joi.string()
    .trim()
    .allow('', null)
    .max(1000)
    .messages({
      'string.max': 'Description cannot exceed 1000 characters'
    }),

  price: Joi.number()
    .min(0)
    .messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price must be a positive number'
    }),

  stockQuantity: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.base': 'Stock quantity must be a number',
      'number.integer': 'Stock quantity must be an integer',
      'number.min': 'Stock quantity cannot be negative'
    })
}).min(1).messages({
  'object.min': 'At least one field is required for update'
});

const getProductSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid product ID format',
      'any.required': 'Product ID is required'
    })
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  getProductSchema
};

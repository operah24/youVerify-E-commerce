const Joi = require('joi');

const createCustomerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .required()
    .min(2)
    .max(100)
    .messages({
      'string.empty': 'Customer name is required',
      'string.min': 'Customer name must be at least 2 characters',
      'string.max': 'Customer name cannot exceed 100 characters',
      'any.required': 'Customer name is required'
    }),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),

  phone: Joi.string()
    .trim()
    .required()
    .pattern(/^[+]?[\d\s\-()]+$/)
    .min(10)
    .max(20)
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Please provide a valid phone number',
      'string.min': 'Phone number must be at least 10 characters',
      'string.max': 'Phone number cannot exceed 20 characters',
      'any.required': 'Phone number is required'
    })
});


const getCustomerSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid customer ID format',
      'any.required': 'Customer ID is required'
    })
});

module.exports = {
  createCustomerSchema,
  getCustomerSchema
};

const Joi = require('joi');

const createOrderSchema = Joi.object({
  customerId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid customer ID format',
      'string.empty': 'Customer ID is required',
      'any.required': 'Customer ID is required'
    }),

  productId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid product ID format',
      'string.empty': 'Product ID is required',
      'any.required': 'Product ID is required'
    }),

  amount: Joi.number()
    .required()
    .min(0)
    .messages({
      'number.base': 'Amount must be a number',
      'number.min': 'Amount must be a positive number',
      'any.required': 'Amount is required'
    }),

  orderStatus: Joi.string()
    .valid('PENDING', 'SUCCESS', 'FAILED')
    .messages({
      'any.only': 'Order status must be one of: PENDING, SUCCESS, FAILED'
    })
});

module.exports = {
  createOrderSchema
};

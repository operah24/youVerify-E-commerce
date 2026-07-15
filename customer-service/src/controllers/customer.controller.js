const customerService = require("../services/customer.service");
const ResponseFormatter = require("../utils/responseFormatter");

exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await customerService.getAllCustomers();

    return ResponseFormatter.success(
      res,
      customers,
      'Customers retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

exports.getCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);

    return ResponseFormatter.success(
      res,
      customer,
      'Customer retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

exports.createCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.createCustomer(req.body);

    return ResponseFormatter.created(
      res,
      customer,
      'Customer created successfully'
    );
  } catch (error) {
    next(error);
  }
};
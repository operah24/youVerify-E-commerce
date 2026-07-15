const ResponseFormatter = require("../utils/responseFormatter");
const orderService = require("../services/order.service");

exports.createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.body);

    return ResponseFormatter.created(
      res,
      order,
      'Order created successfully'
    );
  } catch (error) {
    console.log(error)
    next(error);
  }
};
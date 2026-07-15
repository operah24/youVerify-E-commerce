const service = require("../services/payment.service");
const ResponseFormatter = require("../utils/responseFormatter");

exports.makePayment = async (req, res, next) => {
    try {
        const payment = await service.processPayment(req.body);
        return ResponseFormatter.created(
            res,
            payment,
            'Payment processed successfully'
        );

    } catch (err) {
        next(err);
    }
};
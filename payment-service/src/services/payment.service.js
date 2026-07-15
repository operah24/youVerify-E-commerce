const rabbit = require('../config/rabbitmq');
const { ValidationError } = require('../utils/customError');

exports.processPayment = async(data)=>{
    const { customerId, orderId, amount, productId } = data;

    if (!customerId || !orderId || amount === undefined || amount === null) {
        throw new ValidationError('Missing required fields: customerId, orderId, and amount are required')
    }

    if (amount <= 0) {
      throw new ValidationError('Amount must be greater than zero');
    }

    const transaction = {
        transactionId:`TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        customerId,
        orderId,
        productId,
        amount,
        paymentStatus: "success"
    };
    await rabbit.publish(transaction);

    return{
        success:true,
        message:"Payment Successful"
    };

}
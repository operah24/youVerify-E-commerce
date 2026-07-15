const customerClient = require("../client/customer.client");
const productClient = require("../client/product.client");
const paymentClient = require("../client/payment.client");
const Order = require("../models/order.model");
const { ValidationError, NotFoundError } = require("../utils/customError");
const { createOrderSchema } = require("../validations/order.validation");

exports.createOrder = async(data)=>{
    const { error, value } = createOrderSchema.validate(data);
      if (error) {
        throw new ValidationError(error.details[0].message);
    }
    const customer = await customerClient.findCustomer(value.customerId);

    if(!customer){

        throw new NotFoundError('Customer not found');

    }

    const product = await productClient.findProduct(value.productId);

    if(!product){

        throw new NotFoundError('Product not found');

    }

    const order = await Order.create({
        customerId:value.customerId,
        productId:value.productId,
        amount:value.amount,
        orderStatus:"PENDING"

    });

    await paymentClient.makePayment({
        customerId:value.customerId,
        productId:value.productId,
        orderId:order._id,
        amount:value.amount

    });

    return{
        customerId:order.customerId,
        productId:order.productId,
        orderId:order._id,
        orderStatus:order.orderStatus
    };

};
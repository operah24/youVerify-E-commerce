const axios = require("axios");

exports.makePayment = async(data)=>{

    const response = await axios.post(
        `${process.env.PAYMENT_SERVICE_URL}/payments`,
        data
    );

    return response.data;

}
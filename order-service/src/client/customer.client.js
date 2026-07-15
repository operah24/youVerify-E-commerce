const axios = require("axios");

exports.findCustomer = async(id)=>{

    const response = await axios.get(
        `${process.env.CUSTOMER_SERVICE_URL}/customers/${id}`
    );

    return response.data;

}
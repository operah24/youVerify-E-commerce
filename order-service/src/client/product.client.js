const axios = require("axios");

exports.findProduct = async(id)=>{

    const response = await axios.get(
        `${process.env.PRODUCT_SERVICE_URL}/products/${id}`
    );

    return response.data;

}
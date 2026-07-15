const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
{
    customerId:{
        type:String,
        required:true
    },

    productId:{
        type:String,
        required:true
    },

    amount:{
        type:Number,
        required:true
    },

    orderStatus:{
        type:String,
        enum:["PENDING","SUCCESS","FAILED"],
        default:"PENDING"
    }

},{
    timestamps:true
});

module.exports = mongoose.model("Order",OrderSchema);
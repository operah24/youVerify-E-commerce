const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
{
    transactionId: {
        type: String,
        required: true,
        unique: true
    },

    customerId:{
        type:String,
        required:true
    },

    orderId:{
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

    paymentStatus: {
        type: String,
        enum: ['success', 'failed', 'pending', 'refunded'],
        default: 'pending'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

},
{
    timestamps:true
});

module.exports = mongoose.model(
    "Transaction",
    TransactionSchema
);
const rabbit = require("../config/rabbitmq");

const Transaction = require("../models/transaction.model");

exports.startConsumer = async () => {

    const channel = rabbit.getChannel();

    channel.consume(

        process.env.QUEUE_NAME,

        async (msg) => {

            try {

                const transaction = JSON.parse(
                    msg.content.toString()
                );

                await Transaction.create(transaction);

                console.log("Transaction Saved");

                channel.ack(msg);

            }

            catch (err) {
                console.log(err);
            }

        }

    );

}
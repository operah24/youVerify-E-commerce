const amqp = require("amqplib");

let channel;

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(
            process.env.RABBITMQ_URL
        );

        channel = await connection.createChannel();

        await channel.assertQueue(
            process.env.QUEUE_NAME,
            {
                durable:true
            }
        );

        console.log("RabbitMQ Connected");
    } catch (error) {
        console.error("RabbitMQ connection error:", error.message);
        console.error("Make sure RabbitMQ is running on the correct port (5672)");
        process.exit(1);
    }
};

const publish = async(message)=>{

    channel.sendToQueue(

        process.env.QUEUE_NAME,

        Buffer.from(
            JSON.stringify(message)
        ),

        {
            persistent:true
        }

    );

};

const getChannel = ()=>channel;

module.exports = {
    connectRabbitMQ,
    publish,
    getChannel
};
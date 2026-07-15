const app = require("./app");

const {connectDB} = require("../src/config/database");

const rabbit = require("../src/config/rabbitmq");

const consumer = require("./services/consumer.service");

const PORT = process.env.PORT || 3004;

(async()=>{

    await connectDB();

    await rabbit.connectRabbitMQ();

    await consumer.startConsumer();

    app.listen(PORT,()=>{

        console.log(`Payment Service running on ${PORT}`);

    });

})();
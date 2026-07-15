require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const routes = require("./routes/payment.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/payments", routes);

app.get("/health", (req, res) => {
    res.json({
        service: "Payment Service",
        status: "UP"
    });
});

app.use(errorHandler);

module.exports = app;
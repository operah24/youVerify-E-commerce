require("dotenv").config();

const express = require("express");

const cors = require("cors");

const helmet = require("helmet");

const morgan = require("morgan");

const routes = require("./routes/product.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use("/products", routes);

app.get("/health", (req, res) => {

    res.json({
        service: "Product Service",
        status: "UP"
    });

});

app.use(errorHandler);

module.exports = app;

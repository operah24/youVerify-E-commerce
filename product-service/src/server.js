const app = require("./app");

const { connectDB } = require("./config/database");

connectDB();

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {

    console.log(`Product Service running on ${PORT}`);

});

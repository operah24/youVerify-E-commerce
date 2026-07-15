const app = require("./app");

const { connectDB } = require("./config/database");

connectDB();

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {

    console.log(`Order Service running on ${PORT}`);

});
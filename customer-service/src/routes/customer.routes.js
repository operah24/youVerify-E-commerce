const router = require("express").Router();

const controller = require("../controllers/customer.controller");

router.get("/", controller.getCustomers);

router.get("/:id", controller.getCustomer);

router.post("/", controller.createCustomer);

module.exports = router;
// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();

const recordRoute = require("./records/recordRoutes");
const userRoute = require("./user/userRoutes");
const categoriesRoute = require("./categories/categoriesRoute");

router.use("/records", recordRoute);

router.use("/user", userRoute);

router.use("/categories", categoriesRoute);

module.exports = router;

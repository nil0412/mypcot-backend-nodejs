const express = require("express");
const router = express.Router();

const categoryController = require('../../../controllers/categoryController')

router.get("/", categoryController.get);

router.post("/", categoryController.post);

module.exports = router;
const express = require("express");
const router = express.Router();
const passport = require("passport")

const userController = require("../../../controllers/userController");

router.post("/login", passport.authenticate("local"), userController.login);

router.post("/register", userController.register);

module.exports = router;

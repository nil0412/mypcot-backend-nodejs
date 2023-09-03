const express = require("express");
const router = express.Router();
const passport = require("passport");
const CircularJSON = require('circular-json');

const userController = require("../../../controllers/userController");
const { verifyUser } = require("../../../../authenticate");

router.post("/register", userController.register);
router.post("/login", passport.authenticate("local"), userController.login);
router.get("/logout", passport.authenticate("jwt", { session: false }), userController.logout);
router.post("/refreshToken", userController.refreshToken);

// logged in user details
router.get("/currentUser", passport.authenticate("jwt", { session: false }), userController.currentUser);

module.exports = router;

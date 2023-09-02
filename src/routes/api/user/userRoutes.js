const express = require("express");
const router = express.Router();
const passport = require("passport");
const CircularJSON = require('circular-json');

const userController = require("../../../controllers/userController");
const { verifyUser } = require("../../../../authenticate");

router.post("/register", userController.register);
router.post("/login", passport.authenticate("local"), userController.login);
router.get("/logout", userController.logout);
router.post("/refreshToken", userController.refreshToken);

// logged in user details
router.get("/me", verifyUser, (req, res, next) => {
	const safeJSON = CircularJSON.stringify(req.user);
	res.send(safeJSON);
    // res.send(req.user);
});

module.exports = router;

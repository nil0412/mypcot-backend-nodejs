const express = require("express");
const router = express.Router();
const passport = require("passport");

const categoryController = require('../../../controllers/categoryController');


router.get("/", passport.authenticate("jwt", { session: false }), categoryController.get);

router.post("/", passport.authenticate("jwt", { session: false }), categoryController.post);

module.exports = router;
// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../../../controllers/userController');

const passport = require('passport');
const isAuthenticated = require('../../../middleware/authMiddleware');

router.post('/register', userController.register);
// router.post('/login', userController.login);

// Login route
// router.post('/login', isAuthenticated, userController.login);
router.post('/login', passport.authenticate('local', { failureRedirect: 'http://localhost:3000/login' }),userController.login);


module.exports = router;
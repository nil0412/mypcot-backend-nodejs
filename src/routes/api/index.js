// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();

const recordRoute = require('./records/recordRoutes');
const userRoute = require('./user/userRoutes');

router.use('/records', recordRoute);

router.use('/user', userRoute);

module.exports = router;
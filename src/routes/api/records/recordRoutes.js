const express = require('express');
const router = express.Router();
const recordController = require('../../../controllers/recordController');
const isAuthenticated = require('../../../middleware/authMiddleware');

// Create a new record
router.post('/', isAuthenticated, recordController.createRecord);

// Retrieve a list of records
router.get('/', isAuthenticated, recordController.getRecords);
// router.get('/', recordController.getRecords);

// Retrieve a single record by ID
router.get('/:id', recordController.getRecordByID);

module.exports = router;

